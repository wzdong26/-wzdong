import { defineConfig } from 'tsup';

export default defineConfig((options) => ({
    entry: ['src/index.ts'],
    format: ['cjs', 'iife'],
    outDir: './lib',
    outExtension({ format }) {
        return {
            js: `${format === 'iife' ? '.min' : ''}.js`,
        };
    },
    globalName: 'idb',
    splitting: false,
    exports: 'setupDB',
    clean: true,
    target: ['es6'],
    minify: !options.watch,
    treeshake: true,
    dts: !options.watch,
    metafile: !options.watch,
}));
