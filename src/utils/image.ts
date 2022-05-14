export async function urlToBlob(url: string): Promise<Blob> {
  const result = await fetch(url);
  return result.blob();
}
