export interface Result {
  id: string;
  images: {
    url: string;
    length: number;
  };
  name: string;
  type: string;
}

export interface TrackResult {
  result: {
    id: number;
    title: string;
    full_title: string;
    header_image_thumbnail_url: string;
  }
}
