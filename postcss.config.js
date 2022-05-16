module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    ...(process.env.NETLIFY || true ? { cssnano: {} } : {})
  },
}
