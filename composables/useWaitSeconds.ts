export const waitForSeconds = (seconds: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, seconds));
};
