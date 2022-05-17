import { build } from 'esbuild'
import glob from 'glob'

const entryPoints = glob.sync('./src/**/*.ts')

build({
  entryPoints,
  outbase: './src',
  outfile: 'dist/index.min.mjs',
  format: "esm",
  bundle: true,
  minify: true,
  sourcemap: true,
  external: [
    'vue',
    './node_modules/*',
  ],
  watch: false,
})

build({
  entryPoints,
  outbase: './src',
  outfile: 'dist/index.min.cjs',
  format: "cjs",
  bundle: true,
  minify: true,
  sourcemap: true,
  external: [
    'vue',
    './node_modules/*',
  ],
  watch: false,
})
