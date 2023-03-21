/**
 * @title tsup config
 * @author wzdong
 */

import { defineConfig } from 'tsup';

// iife 全局变量名
const globalName = 'utils';

export default defineConfig((options) => {
    const { minify, watch } = options;
    return {
        entry: [minify ? 'src/index.ts' : 'src'],
        outDir: minify ? 'dist' : 'lib',
        format: minify ? ['cjs', 'iife'] : ['cjs'],
        globalName,
        outExtension({ format }) {
            switch (format) {
                case 'iife':
                    return { js: '.min.js' };
                case 'cjs':
                    return { js: '.js' };
                case 'esm':
                    return { js: '.mjs' };
            }
        },
        splitting: true,
        clean: true,
        target: ['es6'],
        treeshake: true,
        sourcemap: minify,
        dts: !watch && !minify && { resolve: false },
    };
});
