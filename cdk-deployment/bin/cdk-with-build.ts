#!/usr/bin/env node
/**
 * CDK CLI Wrapper with Build Integration
 * 
 * This script wraps CDK CLI commands with build integration, ensuring
 * build artifacts exist before CDK operations that require them.
 * 
 * Features:
 * - Automatically runs builds before synth/deploy/diff if needed
 * - Supports --rebuild flag to force rebuild
 * - Supports --skip-build flag to skip build step
 * - Passes through all CDK CLI arguments
 * - Smart detection of commands that require builds
 * 
 * Usage:
 *   npm run cdk synth              # Build if needed, then synth
 *   npm run cdk diff               # Build if needed, then diff
 *   npm run cdk deploy             # Build if needed, then deploy
 *   npm run cdk deploy -- --rebuild # Force rebuild, then deploy
 *   npm run cdk list               # No build needed, just list
 *   npm run cdk destroy            # No build needed, just destroy
 * 
 * Requirements:
 * - 3.1: Execute npm run docs for API documentation
 * - 3.2: Execute npm run build:demo for demo site
 * - 3.3: Execute npm run build in examples/genesis-ai/ for example site
 * - 3.5: Validate build artifacts exist
 */

import { BuildIntegration } from '../lib/build-integration';
import { BuildConfig } from '../lib/config-types';
import { execSync } from 'child_process';
import { join } from 'path';

/**
 * CDK commands that require build artifacts
 */
const COMMANDS_REQUIRING_BUILD = ['synth', 'deploy', 'diff'];

/**
 * Parse command line arguments
 */
function parseArgs(): {
  rebuild: boolean;
  skipBuild: boolean;
  cdkCommand: string;
  cdkArgs: string[];
} {
  const args = process.argv.slice(2);
  
  const rebuild = args.includes('--rebuild');
  const skipBuild = args.includes('--skip-build');
  
  // Remove our custom flags from CDK args
  const filteredArgs = args.filter(arg => arg !== '--rebuild' && arg !== '--skip-build');
  
  // First arg is the CDK command (synth, deploy, diff, etc.)
  const cdkCommand = filteredArgs[0] || 'synth';
  const cdkArgs = filteredArgs.slice(1);
  
  return { rebuild, skipBuild, cdkCommand, cdkArgs };
}

/**
 * Get build configurations for all sites
 */
function getBuildConfigs(): BuildConfig[] {
  // Project root is one level up from cdk-deployment
  const projectRoot = join(__dirname, '../..');
  
  return [
    {
      command: 'npm run docs',
      workingDir: projectRoot,
      outputDir: join(projectRoot, 'docs/api')
    },
    {
      command: 'npm run build:demo',
      workingDir: projectRoot,
      outputDir: join(projectRoot, 'demo/dist')
    },
    {
      command: 'npm run build',
      workingDir: join(projectRoot, 'examples/genesis-ai'),
      outputDir: join(projectRoot, 'examples/genesis-ai/dist')
    }
  ];
}

/**
 * Check if all build outputs exist
 */
function allOutputsExist(configs: BuildConfig[]): boolean {
  return configs.every(config => BuildIntegration.validateOutputExists(config.outputDir));
}

/**
 * Determine if the CDK command requires builds
 */
function commandRequiresBuilds(cdkCommand: string): boolean {
  return COMMANDS_REQUIRING_BUILD.includes(cdkCommand);
}

/**
 * Determine if builds need to run
 */
function shouldRunBuilds(
  cdkCommand: string,
  rebuild: boolean,
  skipBuild: boolean,
  configs: BuildConfig[]
): boolean {
  // Check if command requires builds
  if (!commandRequiresBuilds(cdkCommand)) {
    console.log(`\n⏭️  Command '${cdkCommand}' does not require builds, skipping build step`);
    return false;
  }
  
  if (skipBuild) {
    console.log('\n⏭️  Skipping build step (--skip-build flag set)');
    return false;
  }
  
  if (rebuild) {
    console.log('\n🔄 Forcing rebuild (--rebuild flag set)');
    return true;
  }
  
  // Check if outputs exist
  const outputsExist = allOutputsExist(configs);
  
  if (outputsExist) {
    console.log('\n✅ All build outputs exist, skipping build step');
    console.log('   Use --rebuild to force rebuild');
    return false;
  } else {
    console.log('\n⚠️  Some build outputs are missing, running builds...');
    return true;
  }
}

/**
 * Run builds if needed
 */
async function runBuildsIfNeeded(
  cdkCommand: string,
  rebuild: boolean,
  skipBuild: boolean,
  configs: BuildConfig[]
): Promise<void> {
  if (!shouldRunBuilds(cdkCommand, rebuild, skipBuild, configs)) {
    return;
  }
  
  // Run all builds in parallel
  const results = await BuildIntegration.buildAll(configs);
  
  // Check if any builds failed
  const hasFailures = results.some(r => !r.success);
  
  if (hasFailures) {
    console.error('\n💥 Build failed. Cannot proceed with CDK command.');
    process.exit(1);
  }
  
  // Validate all outputs exist after build
  console.log('\n🔍 Validating build outputs...');
  const allValid = configs.every(config => {
    const valid = BuildIntegration.validateOutputExists(config.outputDir);
    if (!valid) {
      console.error(`❌ Build output validation failed: ${config.outputDir}`);
    }
    return valid;
  });
  
  if (!allValid) {
    console.error('\n💥 Build output validation failed. Cannot proceed with CDK command.');
    process.exit(1);
  }
  
  console.log('✅ All build outputs validated successfully');
}

/**
 * Execute CDK command
 */
function executeCdkCommand(cdkCommand: string, cdkArgs: string[]): void {
  const fullCommand = [cdkCommand, ...cdkArgs].join(' ');
  
  console.log(`\n🚀 Executing CDK command: cdk ${fullCommand}`);
  console.log('─'.repeat(60));
  
  try {
    execSync(`npx cdk ${fullCommand}`, {
      stdio: 'inherit',
      cwd: join(__dirname, '..')
    });
    
    console.log('─'.repeat(60));
    console.log(`✅ CDK command '${cdkCommand}' completed successfully`);
    
  } catch (error: any) {
    console.error('─'.repeat(60));
    console.error(`❌ CDK command '${cdkCommand}' failed`);
    process.exit(error.status || 1);
  }
}

/**
 * Main function
 */
async function main(): Promise<void> {
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║   AWS CDK CLI with Build Integration                      ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
  
  const { rebuild, skipBuild, cdkCommand, cdkArgs } = parseArgs();
  const configs = getBuildConfigs();
  
  // Display configuration
  console.log('\n📋 Configuration:');
  console.log(`   CDK Command: ${cdkCommand}`);
  console.log(`   CDK Args: ${cdkArgs.length > 0 ? cdkArgs.join(' ') : '(none)'}`);
  console.log(`   Rebuild: ${rebuild}`);
  console.log(`   Skip Build: ${skipBuild}`);
  
  try {
    // Step 1: Run builds if needed
    await runBuildsIfNeeded(cdkCommand, rebuild, skipBuild, configs);
    
    // Step 2: Execute CDK command
    executeCdkCommand(cdkCommand, cdkArgs);
    
    console.log(`\n🎉 CDK command '${cdkCommand}' completed successfully!`);
    
  } catch (error: any) {
    console.error(`\n💥 CDK command '${cdkCommand}' failed:`, error.message);
    process.exit(1);
  }
}

// Run main function
main().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
});
