import { defineConfig } from 'tsup';

export default defineConfig((options) => {
    const { minify, watch } = options;
    return {
        entry: [`./src/${minify ? 'index.ts' : '*'}`],
        outDir: `./${minify ? 'dist' : 'lib'}`,
        format: minify ? ['cjs', 'iife'] : ['cjs'],
        outExtension({ format, options }) {
            switch (format) {
                case 'iife':
                    options.globalName = 'utils';
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
        dts: !watch && !minify,
    };
});
