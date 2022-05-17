import path from 'node:path'
import { build } from 'esbuild'

const targets = {
  core: ['index'],
  'server-renderer': ['index'],
}

const formats = ['esm', 'cjs']

const ext = {
  esm: '.mjs',
  cjs: '.cjs',
}

async function bundle(pkg, mod, format) {
  return build({
    entryPoints: [path.join('src', pkg, mod + '.ts')],
    outbase: 'src',
    outfile: path.join('dist', pkg, mod + ext[format]),
    format,
    bundle: true,
    minify: true,
    sourcemap: true,
    external: [
      'vue',
      './node_modules/*',
    ],
    watch: false,
  })
}

const procs = Object.entries(targets).flatMap(([pkg, mods]) => {
  return mods.flatMap(mod => {
    return formats.flatMap(async fmt => {
      console.log(pkg, mod, fmt)
      return bundle(pkg, mod, fmt)
    })
  })
})

await Promise.all(procs)
