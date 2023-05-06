const IMG_PATH = "https://image.tmdb.org/t/p";

export function makeImagePath(id: string, format?: string) {
  return `${IMG_PATH}/${format ? format : "original"}/${id}`;
}
