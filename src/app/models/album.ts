export interface Album {
  name: string;
  genres: string[];
  images: {
    url: string;
    length: number;
  }
  release_date: string;
  artists: {
    name: string;
    id: string;
  };
  label: string;
  tracks: {
    items: {
      name: string;
      duration_ms: number;
      track_number: number;
      explicit: boolean;
      trackTime: string;
    }[]
  }
  copyrights: {
    type: string;
    text: string;
  }
}
