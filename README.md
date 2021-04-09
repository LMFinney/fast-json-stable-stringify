# fast-json-stable-stringify

This is a TypeScript port of [fast-json-stable-stringify](https://github.com/epoberezkin/fast-json-stable-stringify).
I had trouble using that lib in a project because it [doesn't export as ESM](https://github.com/epoberezkin/fast-json-stable-stringify/issues/8),
so I wrote this port to TypeScript in my project. Later, it became unnecessary, but I wanted to 
keep the code around for myself (and for anyone else who wanted a TypeScript port), so I dropped it here.

The only differences between this fork and the original lib are the addition of [stringify.ts](stringify.ts),
[stringify.spec.ts](stringify.spec.ts), a tweak to .gitignore, and the changes in this file.

This is _not_ a published lib. The tests will _not_ run here. The files compiled and worked in my project,
but I did not need to make them executable here. Feel free to copy the code in [stringify.ts](stringify.ts)
and [stringify.spec.ts](stringify.spec.ts) into your project, if it's useful to you.