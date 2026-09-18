---
'@ripple-ts/rollup-plugin': patch
---

Pass `compilerOptions` to the compiler instead of the raw file id. The third argument to `compile()` was the file path string, so user-provided options such as `mode` were silently ignored.
