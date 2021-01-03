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

export interface FirebaseArtistResult {
  spotifyArtistInfo: {
    id: string;
    images: {
      url: string;
      length: number;
    };
    name: string;
    type: string;
  }
}

export interface FirebaseAlbumResult {
  albumInfo: {
    id: string;
    images: {
      url: string;
      length: number;
    };
    name: string;
    type: string;
  }
}

export interface FirebaseTrackResult {
  trackInfo: {
    id: number;
    title: string;
    full_title: string;
    header_image_thumbnail_url: string;
    primary_artist: {
      name: string;
    }
  }
}
