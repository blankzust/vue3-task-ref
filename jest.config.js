/** @type {import('@jest/types').Config.InitialOptions} */
module.exports = {
  testPathIgnorePatterns: ['/node_modules/'],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx,vue}',
    '!src/lazyload/vue-lazyload/**',
    '!**/demo/**',
    '!**/test/**',
    '!**/lang/**',
  ],
  "transform": {
    "^.+\\.ts?$": "esbuild-jest"
  }
};
