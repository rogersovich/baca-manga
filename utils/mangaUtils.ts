export const generateChapterArray = (chapter: number): string[] => {
  return Array.from({ length: chapter }, (_, i) => (i + 1).toString());
};
