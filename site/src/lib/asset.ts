/** Public file URL under the deploy base, e.g. "/" locally or "/Beauchamp_Lab/" on GitHub Pages. */
export const asset = (path: string) => import.meta.env.BASE_URL + path.replace(/^\//, '')
