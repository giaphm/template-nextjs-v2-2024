module.exports = {
  // Type check TypeScript files
  '**/*.(ts|tsx)': () => 'pnpm exec tsc --noEmit',

  // Lint then format TypeScript and JavaScript files
  '**/*.(ts|tsx|js)': (filenames) => [
    `pnpm exec eslint --fix ${filenames.join(' ')}`,
    `pnpm exec prettier --write ${filenames.join(' ')}`,
  ],

  // Format MarkDown and JSON
  '**/*.(md|json)': (filenames) =>
    `pnpm exec prettier --write ${filenames.join(' ')}`,
}
