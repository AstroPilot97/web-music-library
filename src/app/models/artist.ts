export interface Artist {
  name: string;
  genres: string[];
  images: {
    url: string;
    length: number;
  }
  popularity: number;
}
