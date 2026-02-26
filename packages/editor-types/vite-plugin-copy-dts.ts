import fs from 'fs';
import path from 'path';
import type { Plugin } from 'vite';

/**
 * Options for the copyDts plugin
 */
export interface CopyDtsOptions {
  /**
   * Path to the custom types file to append (relative to project root)
   */
  sourceFile?: string;

  /**
   * Path to the generated type definition file (relative to outDir)
   * @default '@types/index.d.ts'
   */
  targetFile?: string;

  /**
   * Output directory for the build
   * @default 'dist'
   */
  outDir?: string;
}

/**
 * Vite plugin that appends custom type definitions to the generated .d.ts file
 *
 * @example
 * ```ts
 * import { copyDts } from './vite-plugin-copy-dts';
 *
 * export default defineConfig({
 *   plugins: [
 *     dts({ ... }),
 *     copyDts({
 *       sourceFile: 'src/@types/index.d.ts',
 *       targetFile: '@types/index.d.ts',
 *       outDir: 'dist'
 *     })
 *   ]
 * });
 * ```
 */
export function copyDts(options: CopyDtsOptions = {}): Plugin {
  const {
    sourceFile = 'src/@types/index.d.ts',
    targetFile = '@types/index.d.ts',
    outDir = 'dist'
  } = options;

  return {
    name: 'vite-plugin-copy-dts',

    // Run after build completes
    closeBundle() {
      try {
        // Resolve absolute paths
        const root = process.cwd();
        const sourcePath = path.resolve(root, sourceFile);
        const targetPath = path.resolve(root, outDir, targetFile);

        // Check if source file exists
        if (!fs.existsSync(sourcePath)) {
          console.warn(`[copy-dts] Source file not found: ${sourcePath}`);
          return;
        }

        // Check if target file exists
        if (!fs.existsSync(targetPath)) {
          console.warn(`[copy-dts] Target file not found: ${targetPath}`);
          return;
        }

        // Read custom types content
        const customTypes = fs.readFileSync(sourcePath, 'utf-8');

        // Read existing generated types
        const existingTypes = fs.readFileSync(targetPath, 'utf-8');

        // Append custom types with a separator comment
        const separator = '\n\n// ==================== Custom Types ====================\n\n';
        const combinedTypes = existingTypes + separator + customTypes;

        // Write combined content back to target file
        fs.writeFileSync(targetPath, combinedTypes, 'utf-8');

        console.log(`[copy-dts] Successfully appended custom types from ${sourceFile} to ${path.join(outDir, targetFile)}`);
      } catch (error) {
        console.error('[copy-dts] Error appending custom types:', error);
        // Don't throw - we don't want to fail the build
      }
    }
  };
}

export default copyDts;

