import { defineConfig } from 'tsup';

export default defineConfig((options) => ({
    entry: ['src/*'],
    format: ['cjs'],
    outDir: './lib',
    outExtension({ format }) {
        return {
            js: `${format === 'iife' ? '.min' : ''}.js`,
        };
    },
    globalName: 'utils',
    splitting: false,
    clean: true,
    target: ['es6'],
    minify: !options.watch,
    treeshake: true,
    dts: !options.watch,
    metafile: !options.watch,
}));
