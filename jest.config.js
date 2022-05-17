import tsjpresets from 'ts-jest/presets/index.js'

const { defaults: tsj } = tsjpresets

export const config = {
  testEnvironment: 'jsdom',
  moduleFileExtensions: [
    "js",
    "ts",
    "json",
    "vue",
  ],
  transform: {
    ...tsj.transform,
    ".*\\.(vue)$": "vue-jest",
  },
  globals: {
    'ts-jest': {
      useESM: true,
    },
  },
}
console.log(config)
export default config
