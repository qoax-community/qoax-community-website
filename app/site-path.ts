const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function siteAsset(source: string) {
  if (!source.startsWith("/")) return source;
  return `${basePath}${source}`;
}
