import { defineConfig } from 'tsup';

export default defineConfig((options) => ({
    entry: ['src/**/**'],
    format: ['cjs', 'iife'],
    outDir: './lib',
    outExtension({ format }) {
        switch(format) {
            case 'iife':
                return {js: '.min.js'}
            case 'cjs':
                return {js: '.cjs'}
            case 'esm':
                return {js: '.mjs'}
        }
    },
    globalName: 'utils',
    splitting: true,
    clean: true,
    target: ['es6'],
    minify: !options.watch,
    treeshake: true,
    dts: !options.watch,
    metafile: !options.watch,
}));
