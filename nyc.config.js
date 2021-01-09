module.exports = {
  reporter: ["lcov", "text"],
  "include": [
    "src/**/*.ts"
  ],
  "exclude": [
    "**/*.test.ts",
    "**/index.ts"
  ]
}