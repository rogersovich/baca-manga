export function handleImageError(event: Event) {
  const target = event.target as HTMLImageElement;
  target.src = "/images/fallback-image.png"; // ✅ Fallback image when error occurs
}
