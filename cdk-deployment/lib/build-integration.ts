/**
 * Build Integration Utility
 * 
 * This module handles build command execution before deployment, ensuring
 * build artifacts exist before CDK deployment proceeds.
 * 
 * Supports:
 * - Executing npm build commands
 * - Validating build outputs exist
 * - Parallel builds for faster deployment
 * - Clear error reporting for build failures
 */

import { execSync } from 'child_process';
import { existsSync, readdirSync, statSync } from 'fs';
import { join } from 'path';
import { BuildConfig, BuildResult } from './config-types';

/**
 * BuildIntegration utility class
 * 
 * Handles build command execution and validation for static site deployment.
 * 
 * Requirements:
 * - 3.1: Execute npm run docs for API documentation
 * - 3.2: Execute npm run build:demo for demo site
 * - 3.3: Execute npm run build in examples/genesis-ai/ for example site
 * - 3.4: Halt deployment on build failure
 * - 3.5: Validate build artifacts exist
 */
export class BuildIntegration {
  /**
   * Build a single site by executing its build command
   * 
   * @param config - Build configuration including command, working directory, and output directory
   * @returns Promise resolving to build result
   * 
   * @example
   * ```typescript
   * const result = await BuildIntegration.buildSite({
   *   command: 'npm run docs',
   *   workingDir: '.',
   *   outputDir: 'docs/api'
   * });
   * 
   * if (!result.success) {
   *   console.error(`Build failed: ${result.error}`);
   * }
   * ```
   */
  static async buildSite(config: BuildConfig): Promise<BuildResult> {
    const startTime = Date.now();
    const siteName = this.getSiteNameFromCommand(config.command, config.workingDir);
    
    try {
      console.log(`\n🔨 Building ${siteName}...`);
      console.log(`   Command: ${config.command}`);
      console.log(`   Working directory: ${config.workingDir}`);
      console.log(`   Output directory: ${config.outputDir}`);
      
      // Execute build command and capture output
      // Using 'pipe' to capture stdout/stderr while still showing output
      const output = execSync(config.command, {
        cwd: config.workingDir,
        stdio: ['inherit', 'pipe', 'pipe'], // stdin: inherit, stdout: pipe, stderr: pipe
        encoding: 'utf-8'
      });
      
      // Show captured output
      if (output) {
        console.log(output);
      }
      
      // Validate output exists
      if (!this.validateOutputExists(config.outputDir)) {
        const duration = Date.now() - startTime;
        const errorMsg = `Build completed but output directory is empty or missing: ${config.outputDir}`;
        console.error(`\n❌ ${errorMsg}`);
        console.error(`\nPlease check your build configuration and try again.`);
        
        return {
          success: false,
          siteName,
          outputDir: config.outputDir,
          error: errorMsg,
          duration
        };
      }
      
      const duration = Date.now() - startTime;
      console.log(`✅ ${siteName} built successfully in ${duration}ms`);
      
      return {
        success: true,
        siteName,
        outputDir: config.outputDir,
        duration
      };
      
    } catch (error: any) {
      const duration = Date.now() - startTime;
      
      // Extract detailed error information
      const exitCode = error.status || error.code || 'unknown';
      const stdout = error.stdout?.toString() || '';
      const stderr = error.stderr?.toString() || '';
      const errorMessage = error.message || String(error);
      
      // Build comprehensive error output
      const fullErrorOutput = this.formatBuildError(stdout, stderr, errorMessage);
      
      // Display formatted error
      console.error(`\n❌ Build failed for ${siteName}`);
      console.error(`   Command: ${config.command}`);
      console.error(`   Exit code: ${exitCode}`);
      
      if (fullErrorOutput) {
        console.error(`\nError output:`);
        console.error(fullErrorOutput);
      }
      
      console.error(`\nPlease fix the build errors and try again.`);
      
      return {
        success: false,
        siteName,
        outputDir: config.outputDir,
        error: fullErrorOutput || errorMessage,
        duration
      };
    }
  }
  
  /**
   * Build all sites in parallel for faster deployment
   * 
   * Executes all build commands concurrently and waits for all to complete.
   * If any build fails, all results are returned but deployment should be halted.
   * 
   * @param configs - Array of build configurations for all sites
   * @returns Promise resolving to array of build results
   * 
   * @example
   * ```typescript
   * const results = await BuildIntegration.buildAll([
   *   { command: 'npm run docs', workingDir: '.', outputDir: 'docs/api' },
   *   { command: 'npm run build:demo', workingDir: '.', outputDir: 'demo/dist' }
   * ]);
   * 
   * const allSucceeded = results.every(r => r.success);
   * if (!allSucceeded) {
   *   console.error('Some builds failed');
   *   process.exit(1); // Exit with non-zero status
   * }
   * ```
   */
  static async buildAll(configs: BuildConfig[]): Promise<BuildResult[]> {
    console.log(`\n🚀 Starting parallel builds for ${configs.length} site(s)...`);
    
    const startTime = Date.now();
    
    // Execute all builds in parallel
    const buildPromises = configs.map(config => this.buildSite(config));
    const results = await Promise.all(buildPromises);
    
    const totalDuration = Date.now() - startTime;
    const successCount = results.filter(r => r.success).length;
    const failureCount = results.length - successCount;
    
    console.log(`\n📊 Build Summary:`);
    console.log(`   Total time: ${totalDuration}ms`);
    console.log(`   Successful: ${successCount}`);
    console.log(`   Failed: ${failureCount}`);
    
    if (failureCount > 0) {
      console.error(`\n❌ ${failureCount} build(s) failed. Deployment cannot proceed.`);
      const failedSites = results.filter(r => !r.success).map(r => r.siteName);
      console.error(`   Failed sites: ${failedSites.join(', ')}`);
      console.error(`\n⚠️  Fix the build errors above and try again.`);
    } else {
      console.log(`\n✅ All builds completed successfully!`);
    }
    
    return results;
  }
  
  /**
   * Build all sites and exit with appropriate status code
   * 
   * This is a convenience method that builds all sites and exits the process
   * with status code 1 if any builds fail, or 0 if all succeed.
   * 
   * Use this in CLI scripts to ensure proper exit codes for CI/CD pipelines.
   * 
   * @param configs - Array of build configurations for all sites
   * @returns Promise that resolves when builds complete (process will exit)
   * 
   * @example
   * ```typescript
   * // In a CLI script
   * await BuildIntegration.buildAllAndExit(
   *   BuildIntegration.getDefaultBuildConfigs()
   * );
   * // Process will exit with code 0 (success) or 1 (failure)
   * ```
   */
  static async buildAllAndExit(configs: BuildConfig[]): Promise<never> {
    const results = await this.buildAll(configs);
    const hasFailures = results.some(r => !r.success);
    
    if (hasFailures) {
      console.error(`\n💥 Build process failed. Exiting with status code 1.`);
      process.exit(1);
    } else {
      console.log(`\n🎉 All builds completed successfully. Exiting with status code 0.`);
      process.exit(0);
    }
  }
  
  /**
   * Validate that a build output directory exists and contains files
   * 
   * Checks that:
   * 1. The directory exists
   * 2. The directory is not empty
   * 3. The directory contains at least one file (not just subdirectories)
   * 
   * @param outputDir - Path to the output directory to validate
   * @returns true if output exists and is valid, false otherwise
   * 
   * @example
   * ```typescript
   * if (BuildIntegration.validateOutputExists('docs/api')) {
   *   console.log('Build artifacts found');
   * } else {
   *   console.error('Build artifacts missing');
   * }
   * ```
   */
  static validateOutputExists(outputDir: string): boolean {
    try {
      // Check if directory exists
      if (!existsSync(outputDir)) {
        console.warn(`⚠️  Output directory does not exist: ${outputDir}`);
        return false;
      }
      
      // Check if it's actually a directory
      const stats = statSync(outputDir);
      if (!stats.isDirectory()) {
        console.warn(`⚠️  Output path is not a directory: ${outputDir}`);
        return false;
      }
      
      // Check if directory contains any files (recursively)
      const hasFiles = this.directoryHasFiles(outputDir);
      if (!hasFiles) {
        console.warn(`⚠️  Output directory is empty: ${outputDir}`);
        return false;
      }
      
      return true;
      
    } catch (error) {
      console.warn(`⚠️  Error validating output directory: ${error}`);
      return false;
    }
  }
  
  /**
   * Check if a directory contains any files (recursively)
   * 
   * @param dirPath - Path to directory to check
   * @returns true if directory contains at least one file
   */
  private static directoryHasFiles(dirPath: string): boolean {
    try {
      const entries = readdirSync(dirPath);
      
      for (const entry of entries) {
        const fullPath = join(dirPath, entry);
        const stats = statSync(fullPath);
        
        if (stats.isFile()) {
          return true; // Found at least one file
        } else if (stats.isDirectory()) {
          // Recursively check subdirectories
          if (this.directoryHasFiles(fullPath)) {
            return true;
          }
        }
      }
      
      return false; // No files found
      
    } catch (error) {
      console.warn(`⚠️  Error reading directory ${dirPath}: ${error}`);
      return false;
    }
  }
  
  /**
   * Format build error output from stdout, stderr, and error message
   * 
   * Combines all available error information into a comprehensive error message.
   * Prioritizes stderr (build errors) over stdout (build logs).
   * 
   * @param stdout - Standard output from build command
   * @param stderr - Standard error from build command
   * @param errorMessage - Error message from exception
   * @returns Formatted error output
   */
  private static formatBuildError(stdout: string, stderr: string, errorMessage: string): string {
    const parts: string[] = [];
    
    // Add stderr first (most relevant for build errors)
    if (stderr && stderr.trim()) {
      parts.push('=== Build Error Output (stderr) ===');
      parts.push(stderr.trim());
    }
    
    // Add stdout if it contains useful information
    if (stdout && stdout.trim()) {
      parts.push('=== Build Output (stdout) ===');
      parts.push(stdout.trim());
    }
    
    // Add error message if it's not already included in stderr/stdout
    if (errorMessage && errorMessage.trim()) {
      const errorText = errorMessage.trim();
      const alreadyIncluded = stderr.includes(errorText) || stdout.includes(errorText);
      
      if (!alreadyIncluded) {
        parts.push('=== Error Message ===');
        parts.push(errorText);
      }
    }
    
    return parts.join('\n\n');
  }
  
  /**
   * Extract a human-readable site name from a build command and working directory
   * 
   * @param command - Build command (e.g., 'npm run docs')
   * @param workingDir - Working directory for the command
   * @returns Human-readable site name
   */
  private static getSiteNameFromCommand(command: string, workingDir?: string): string {
    if (command.includes('docs')) {
      return 'API Documentation';
    } else if (command.includes('demo')) {
      return 'Demo Site';
    } else if (workingDir && (workingDir.includes('genesis-ai') || workingDir.includes('example'))) {
      return 'Example Site';
    } else if (command.includes('genesis-ai') || command.includes('example')) {
      return 'Example Site';
    } else {
      return 'Site';
    }
  }
  
  /**
   * Get default build configurations for all three sites
   * 
   * Returns build configurations for:
   * - API Documentation (npm run docs)
   * - Demo Site (npm run build:demo)
   * - Example Site (npm run build in examples/genesis-ai/)
   * 
   * @param projectRoot - Root directory of the project (defaults to current directory)
   * @returns Array of build configurations
   * 
   * @example
   * ```typescript
   * const configs = BuildIntegration.getDefaultBuildConfigs();
   * const results = await BuildIntegration.buildAll(configs);
   * ```
   */
  static getDefaultBuildConfigs(projectRoot: string = '.'): BuildConfig[] {
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
}
