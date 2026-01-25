#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Resolve the docs path relative to the mcp-server directory
const DOCS_PATH = path.resolve(__dirname, '../../docs/api');

interface DocEntry {
  name: string;
  type: 'function' | 'interface' | 'type' | 'class' | 'variable';
  path: string;
  content?: string;
}

// Cache for parsed documentation
let docCache: DocEntry[] | null = null;

/**
 * Parse HTML content to extract meaningful text
 */
function extractTextFromHtml(html: string): string {
  // Remove script and style tags
  let text = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
  text = text.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
  
  // Extract content from specific TypeDoc sections
  const signatureMatch = text.match(/<section class="tsd-panel[^"]*tsd-signatures[^"]*">([\s\S]*?)<\/section>/gi);
  const descriptionMatch = text.match(/<div class="tsd-comment[^"]*">([\s\S]*?)<\/div>/gi);
  const parametersMatch = text.match(/<section class="tsd-panel[^"]*tsd-type-parameters[^"]*">([\s\S]*?)<\/section>/gi);
  
  // Remove HTML tags but keep structure with newlines
  const cleanHtml = (str: string) => {
    return str
      .replace(/<\/?(h[1-6]|p|div|li|tr)[^>]*>/gi, '\n')
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\s+/g, ' ')
      .replace(/\n\s+/g, '\n')
      .trim();
  };

  let result = '';
  
  // Get page title
  const titleMatch = text.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  if (titleMatch) {
    result += 'Name: ' + cleanHtml(titleMatch[1]) + '\n\n';
  }

  // Get description
  if (descriptionMatch) {
    result += 'Description:\n' + descriptionMatch.map(d => cleanHtml(d)).join('\n') + '\n\n';
  }

  // Get signatures
  if (signatureMatch) {
    result += 'Signatures:\n' + signatureMatch.map(s => cleanHtml(s)).join('\n') + '\n\n';
  }

  // Get parameters
  if (parametersMatch) {
    result += 'Type Parameters:\n' + parametersMatch.map(p => cleanHtml(p)).join('\n') + '\n\n';
  }

  // Fallback: get the main content area
  if (!result) {
    const mainContent = text.match(/<div class="col-content">([\s\S]*?)<\/div>\s*<aside/i);
    if (mainContent) {
      result = cleanHtml(mainContent[1]);
    } else {
      result = cleanHtml(text);
    }
  }

  return result.slice(0, 10000); // Limit size
}

/**
 * Scan the docs directory and build the documentation index
 */
function buildDocIndex(): DocEntry[] {
  if (docCache) return docCache;

  const entries: DocEntry[] = [];
  
  const categories: { dir: string; type: DocEntry['type'] }[] = [
    { dir: 'functions', type: 'function' },
    { dir: 'interfaces', type: 'interface' },
    { dir: 'types', type: 'type' },
    { dir: 'classes', type: 'class' },
    { dir: 'variables', type: 'variable' },
  ];

  for (const { dir, type } of categories) {
    const dirPath = path.join(DOCS_PATH, dir);
    if (fs.existsSync(dirPath)) {
      const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.html'));
      for (const file of files) {
        const name = file.replace('.html', '');
        entries.push({
          name,
          type,
          path: path.join(dirPath, file),
        });
      }
    }
  }

  docCache = entries;
  return entries;
}

/**
 * Search the documentation index
 */
function searchDocs(query: string, type?: string): DocEntry[] {
  const entries = buildDocIndex();
  const lowerQuery = query.toLowerCase();
  
  return entries.filter(entry => {
    const matchesQuery = entry.name.toLowerCase().includes(lowerQuery);
    const matchesType = !type || entry.type === type;
    return matchesQuery && matchesType;
  });
}

/**
 * Get full documentation for an entry
 */
function getDocContent(entry: DocEntry): string {
  try {
    const html = fs.readFileSync(entry.path, 'utf-8');
    return extractTextFromHtml(html);
  } catch (error) {
    return `Error reading documentation: ${error}`;
  }
}

/**
 * List all available components
 */
function listComponents(): string[] {
  const entries = buildDocIndex();
  const components = new Set<string>();
  
  for (const entry of entries) {
    // Extract component name from function names like createButton, ButtonProps, etc.
    let componentName = entry.name;
    
    if (componentName.startsWith('create')) {
      componentName = componentName.replace('create', '');
    } else if (componentName.endsWith('Props')) {
      componentName = componentName.replace('Props', '');
    } else if (componentName.endsWith('Instance')) {
      componentName = componentName.replace('Instance', '');
    } else if (componentName.endsWith('Element')) {
      componentName = componentName.replace('Element', '');
    } else if (componentName.endsWith('State')) {
      componentName = componentName.replace('State', '');
    }
    
    if (componentName && componentName.length > 0) {
      components.add(componentName);
    }
  }
  
  return Array.from(components).sort();
}

/**
 * Get all documentation for a specific component
 */
function getComponentDocs(componentName: string): string {
  const entries = buildDocIndex();
  const lowerName = componentName.toLowerCase();
  
  const related = entries.filter(e => 
    e.name.toLowerCase().includes(lowerName) ||
    e.name.toLowerCase() === `create${lowerName}` ||
    e.name.toLowerCase() === `${lowerName}props` ||
    e.name.toLowerCase() === `${lowerName}instance` ||
    e.name.toLowerCase() === `${lowerName}element`
  );

  if (related.length === 0) {
    return `No documentation found for component: ${componentName}`;
  }

  let result = `# ${componentName} Component Documentation\n\n`;
  
  for (const entry of related) {
    result += `## ${entry.name} (${entry.type})\n`;
    result += getDocContent(entry);
    result += '\n\n---\n\n';
  }

  return result;
}

// Create the MCP server
const server = new Server(
  {
    name: 'dosage-docs',
    version: '0.1.0',
  },
  {
    capabilities: {
      resources: {},
      tools: {},
    },
  }
);

// List available resources
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  const entries = buildDocIndex();
  
  return {
    resources: entries.map(entry => ({
      uri: `dosage://docs/${entry.type}/${entry.name}`,
      mimeType: 'text/plain',
      name: entry.name,
      description: `${entry.type}: ${entry.name}`,
    })),
  };
});

// Read a specific resource
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const uri = request.params.uri;
  const match = uri.match(/^dosage:\/\/docs\/(\w+)\/(.+)$/);
  
  if (!match) {
    throw new Error(`Invalid resource URI: ${uri}`);
  }

  const [, type, name] = match;
  const entries = buildDocIndex();
  const entry = entries.find(e => e.type === type && e.name === name);
  
  if (!entry) {
    throw new Error(`Resource not found: ${uri}`);
  }

  return {
    contents: [
      {
        uri,
        mimeType: 'text/plain',
        text: getDocContent(entry),
      },
    ],
  };
});

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'search_docs',
        description: 'Search DOSage documentation for functions, interfaces, types, or components by name',
        inputSchema: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: 'Search query (component name, function name, etc.)',
            },
            type: {
              type: 'string',
              enum: ['function', 'interface', 'type', 'class', 'variable'],
              description: 'Filter by documentation type',
            },
          },
          required: ['query'],
        },
      },
      {
        name: 'get_component_docs',
        description: 'Get complete documentation for a DOSage component including its factory function, props interface, and related types',
        inputSchema: {
          type: 'object',
          properties: {
            component: {
              type: 'string',
              description: 'Component name (e.g., "Button", "Modal", "TextInput")',
            },
          },
          required: ['component'],
        },
      },
      {
        name: 'list_components',
        description: 'List all available DOSage components',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'get_function_signature',
        description: 'Get the signature and documentation for a specific function',
        inputSchema: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'Function name (e.g., "createButton", "createModal")',
            },
          },
          required: ['name'],
        },
      },
      {
        name: 'get_interface',
        description: 'Get the definition and documentation for a specific TypeScript interface',
        inputSchema: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'Interface name (e.g., "ButtonProps", "ModalProps")',
            },
          },
          required: ['name'],
        },
      },
      {
        name: 'get_type',
        description: 'Get the definition and documentation for a specific TypeScript type',
        inputSchema: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'Type name (e.g., "ButtonVariant", "ThemePreset")',
            },
          },
          required: ['name'],
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  switch (name) {
    case 'search_docs': {
      const query = (args as { query: string; type?: string }).query;
      const type = (args as { query: string; type?: string }).type;
      const results = searchDocs(query, type);
      
      if (results.length === 0) {
        return {
          content: [{ type: 'text', text: `No documentation found for: ${query}` }],
        };
      }

      const summary = results.map(r => `- ${r.name} (${r.type})`).join('\n');
      return {
        content: [{ 
          type: 'text', 
          text: `Found ${results.length} result(s):\n${summary}\n\nUse get_component_docs, get_function_signature, get_interface, or get_type for full details.`
        }],
      };
    }

    case 'get_component_docs': {
      const component = (args as { component: string }).component;
      const docs = getComponentDocs(component);
      return {
        content: [{ type: 'text', text: docs }],
      };
    }

    case 'list_components': {
      const components = listComponents();
      return {
        content: [{ 
          type: 'text', 
          text: `Available DOSage components (${components.length}):\n${components.join(', ')}`
        }],
      };
    }

    case 'get_function_signature': {
      const funcName = (args as { name: string }).name;
      const entries = buildDocIndex();
      const entry = entries.find(e => e.type === 'function' && e.name.toLowerCase() === funcName.toLowerCase());
      
      if (!entry) {
        return {
          content: [{ type: 'text', text: `Function not found: ${funcName}` }],
        };
      }

      return {
        content: [{ type: 'text', text: getDocContent(entry) }],
      };
    }

    case 'get_interface': {
      const interfaceName = (args as { name: string }).name;
      const entries = buildDocIndex();
      const entry = entries.find(e => e.type === 'interface' && e.name.toLowerCase() === interfaceName.toLowerCase());
      
      if (!entry) {
        return {
          content: [{ type: 'text', text: `Interface not found: ${interfaceName}` }],
        };
      }

      return {
        content: [{ type: 'text', text: getDocContent(entry) }],
      };
    }

    case 'get_type': {
      const typeName = (args as { name: string }).name;
      const entries = buildDocIndex();
      const entry = entries.find(e => e.type === 'type' && e.name.toLowerCase() === typeName.toLowerCase());
      
      if (!entry) {
        return {
          content: [{ type: 'text', text: `Type not found: ${typeName}` }],
        };
      }

      return {
        content: [{ type: 'text', text: getDocContent(entry) }],
      };
    }

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
});

// Start the server
async function main() {
  // Check if docs exist
  if (!fs.existsSync(DOCS_PATH)) {
    console.error(`Documentation not found at ${DOCS_PATH}`);
    console.error('Please run "npm run docs" first to generate the TypeDoc documentation.');
    process.exit(1);
  }

  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('DOSage MCP Server running on stdio');
}

main().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
