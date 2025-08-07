export function topLanguages(langs: Record<string, number>, topN = 5): string[] {
  return Object.entries(langs)
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN)
    .map(([name]) => name);
}


