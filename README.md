# 🐚 zx

> A Deno version of https://github.com/google/zx

```js
#!/usr/bin/env zx

await $`cat package.json | grep name`

let branch = await $`git branch --show-current`
await $`dep deploy --branch=${branch}`

await Promise.all([
  $`sleep 1; echo 1`,
  $`sleep 2; echo 2`,
  $`sleep 3; echo 3`,
])

let name = 'foo bar'
await $`mkdir /tmp/${name}`
```

Bash is great, but when it comes to writing scripts, 
people usually choose a more convenient programming language.
JavaScript is a perfect choice, but standard Node.js library 
requires additional hassle before using. `zx` package provides
useful wrappers around `Deno.run`, escapes arguments and 
gives sensible defaults.

## Install

```bash
deno install --A --unstable https://github.com/Minigugus/zx-deno/raw/main/zx.mjs
```

Required permissions:
 * `--allow-run` to allow running commands
 * `--allow-read` to `await import` the script to run
 * `--allow-env` for subprocess to work correctly

Not that scripts permissions inherits `zx` permissions

## Documentation

Write your scripts in a file with `.mjs` extension in order to 
be able to use `await` on top level. If you prefer `.js` extension,
wrap your script in something like `void async function () {...}()`.

Add next shebang at the beginning of your script:
```bash
#!/usr/bin/env zx
```

Now you will be able to run your script as:
```bash
chmod +x ./script.mjs
./script.mjs
```

Or via `zx` bin:

```bash
zx ./script.mjs
```

Then using `zx` bin or via shebang, all `$`, `cd`, `fetch`, etc 
available without imports.

### ``$`command` ``

Executes given string using `Deno.run` function and returns `Promise<ProcessOutput>`.

```js
let count = parseInt(await $`ls -1 | wc -l`)
console.log(`Files count: ${count}`)
```

Example. Upload files in parallel:

```js
let hosts = [...]
await Promise.all(hosts.map(host =>
  $`rsync -azP ./src ${host}:/var/www`  
))
```

If executed program returns non-zero exit code, `ProcessOutput` will be thrown.

```js
try {
  await $`exit 1`
} catch (p) {
  console.log(`Exit code: ${p.exitCode}`)
  console.log(`Error: ${p.stderr}`)
}
```

### `ProcessOutput`

```ts
class ProcessOutput {
  readonly exitCode: number
  readonly stdout: string
  readonly stderr: string
  toString(): string
}
```

### `cd()`

Changes working directory.

```js
cd('/tmp')
await $`pwd` // outputs /tmp 
```

### `fetch()`

The native `fetch()` function provided by `Deno`
```js
let resp = await fetch('http://wttr.in')
if (resp.ok) {
  console.log(await resp.text())
}
```

### `question()`

This is a wrapper around `window.prompt`. As of now, the `option` parameter is ignored.

```ts
type QuestionOptions = { choices: string[] }

function question(query: string, options?: QuestionOptions): Promise<string>
```

Usage:

```js
let username = await question('What is your username? ')
let token = await question('Choose env variable: ', {
  choices: Object.keys(Deno.env.toObject())
})
```



### `chalk` package

The [chalk](https://www.npmjs.com/package/chalk) package provided in the original `zx` package is replaced by the standard `https://deno.land/std/fmt/colors.ts` module

```js
console.log(colors.blue('Hello world!'))
```

### `fs` package

The [fs](https://deno.land/std@0.95.0/node/fs.ts) module available without importing inside scripts.

```js
let content = await fs.readFile('./package.json')
```

Promisified version imported by default. Same as if you write: 

```js
import {promises as fs} from 'https://deno.land/std@0.95.0/node/fs.ts'
```

### `os` package

The [os](https://deno.land/std@0.95.0/node/os.ts) package available without importing
inside scripts.

```js
await $`cd ${os.homedir()} && mkdir example`
```

### `$.shell`

Specifies what shell is used. Default is `/bin/bash`.

```js
$.shell = '/usr/bin/bash'
```

### `$.verbose`

Specifies verbosity. Default: `true`.

In verbose mode prints executed commands with outputs of it. Same as 
`set -x` in bash.

### Importing from other scripts

It's possible to use `$` and others with explicit import.

```js
#!/usr/bin/env node
import {$} from 'https://github.com/Minigugus/zx-deno/raw/main/zx.mjs'
await $`date`
```

### Passing env variables

```js
Deno.env.set('FOO', 'bar')
await $`echo $FOO`
```

### Executing remote scripts

If arg to `zx` bin starts with `https://`, it will be downloaded and executed.

```bash
zx https://medv.io/example-script.mjs
```

## License

[Apache-2.0](LICENSE)
