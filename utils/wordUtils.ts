export const normalizeJapaneseName = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/ou/g, "o") // Convert 'ou' to 'o' (Kentarou -> Kentaro)
    .replace(/\s+/g, " ") // Replace multiple spaces with a single space
    .trim(); // Remove leading/trailing spaces
};

export const isAuthorMatch = (relName: string, targetName: string): boolean => {
  const normalizedRel = normalizeJapaneseName(relName);
  const normalizedTarget = normalizeJapaneseName(targetName);
  return normalizedRel === normalizedTarget;
};
