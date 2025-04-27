// postcss.config.cjs
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {}, // Correct plugin for v4
    autoprefixer: {},
  },
};