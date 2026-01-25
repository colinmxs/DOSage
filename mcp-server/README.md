# DOSage MCP Server

A Model Context Protocol (MCP) server that provides programmatic access to the DOSage TypeDoc documentation. This allows AI agents to query component definitions, interfaces, types, and function signatures.

## Features

- **Search Documentation**: Search across all DOSage documentation by name
- **Component Documentation**: Get complete documentation for any component (factory function, props, types)
- **Type Definitions**: Query specific interfaces and types
- **Function Signatures**: Get detailed function signatures and parameter info

## Available Tools

| Tool | Description |
|------|-------------|
| `search_docs` | Search documentation by name with optional type filter |
| `list_components` | List all available DOSage components |
| `get_component_docs` | Get complete documentation for a component |
| `get_function_signature` | Get a specific function's signature and docs |
| `get_interface` | Get a specific TypeScript interface definition |
| `get_type` | Get a specific TypeScript type definition |

## Installation

From the DOSage root directory:

```bash
# Build docs first (if not already done)
npm run docs

# Install MCP server dependencies and build
cd mcp-server
npm install
npm run build
```

## Usage

### Running with npm scripts (from root)

```bash
# Ensure docs are built and start MCP server
npm run mcp:start

# Or just start the server (assumes docs exist)
npm run mcp:server
```

### Manual start

```bash
cd mcp-server
npm start
```

## Configuration

### VS Code / Copilot

Add to your VS Code settings or MCP configuration:

```json
{
  "mcpServers": {
    "dosage-docs": {
      "command": "node",
      "args": ["./mcp-server/dist/index.js"],
      "cwd": "/path/to/DOSage"
    }
  }
}
```

### Claude Desktop

Add to `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "dosage-docs": {
      "command": "node",
      "args": ["/path/to/DOSage/mcp-server/dist/index.js"]
    }
  }
}
```

## Example Queries

Once connected, an AI agent can:

```
# List all components
"What components are available in DOSage?"

# Get Button documentation
"Show me the documentation for the Button component"

# Search for modal-related items
"Search for anything related to 'modal' in the docs"

# Get a specific interface
"What properties does ButtonProps have?"

# Get a type definition
"What are the available ButtonVariant values?"
```

## Development

```bash
# Watch mode (rebuild on changes)
npm run dev

# Build only
npm run build
```

## Requirements

- Node.js 18+
- DOSage TypeDoc documentation must be generated (`npm run docs` from root)
