export * from './index.mjs'

if (import.meta.main) {
  await import('./zx.mjs');
}
