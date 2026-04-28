# metalnames
List of metal-inspired name fragments and generators.

## Usage

```js
const metalnames = require("metalnames");

metalnames.random(); // Backward-compatible: one random entry from the full list.
metalnames.generate(); // New: generated multi-part metal name.
metalnames.generateMany(5); // New: array of generated names.
```

## Node command-line examples

Print one random base fragment:

```bash
node -e "const m=require('metalnames'); console.log(m.random())"
```

Print one generated full name:

```bash
node -e "const m=require('metalnames'); console.log(m.generate())"
```

Print 10 generated names (one per line):

```bash
node -e "const m=require('metalnames'); m.generateMany(10).forEach((name)=>console.log(name))"
```

Generate shorter names (favor 2-word structures):

```bash
node -e "const m=require('metalnames'); console.log(m.generate({ includeThirdWord: false }))"
```

Generate names and format as JSON:

```bash
node -e "const m=require('metalnames'); console.log(JSON.stringify(m.generateMany(5), null, 2))"
```

## CLI usage

Run directly with npx (no install):

```bash
npx metalnames --count 5
```

Install globally and use the executable:

```bash
npm install -g metalnames
metalnames --count 5
```

Generate short names and print JSON:

```bash
metalnames --count 8 --short --json
```

Show help:

```bash
metalnames --help
```

## Development

Run tests:

```bash
npm test
```
