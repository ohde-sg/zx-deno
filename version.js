// Copyright 2021 Google LLC
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//     https://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

export let version = '(unknown)';

try {
  const pkgJSON = new URL('./package.json', import.meta.url);
  if (import.meta.url.startsWith('file:'))
    version = JSON.parse(await Deno.readTextFile(pkgJSON)).version
  else
    version = (await (await fetch(pkgJSON)).json()).version
} catch {}
