import { defineConfig } from 'tsup'

export default defineConfig({
    entry: ['src/index.ts'],
    format: ['esm', 'iife'],
    outDir: './lib',
    outExtension({ format }) {
        return {
            js: `${format === 'iife' ? '.min' : ''}.js`,
        }
    },
    splitting: false,
    clean: true,
    target: 'es6',
    minify: true,
    treeshake: true,
    dts: true,
})
