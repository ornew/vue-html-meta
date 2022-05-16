import { build } from 'esbuild'
import glob from 'glob'

const entryPoints = glob.sync('./src/**/*.ts')

build({
  entryPoints,
  outbase: './src',
  outdir: './lib' ,
  platform: 'node',
  external: [],
  watch: false,
})
