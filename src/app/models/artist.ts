export interface SpotifyArtist {
  name: string;
  id: string;
  genres: string[];
  images: {
    url: string;
    length: number;
  }
  followers: {
    total: number;
  }
  popularity: number;
}

export interface LastFMArtist {
  artist: {
    name: string;
    bio: {
      content: string;
      summary: string;
    }
    similar: {
      artist: {
        image: {
          text: string;
        }
        name: string;
      }
    }
  }
}

export interface SimilarArtist {
  artists: {
    artists: {
      id: string;
      images: {
        url: string;
        length: number;
      }
      name: string;
    }
  }
}

export interface ArtistAlbums {
  id: number;
  name: string;
  images: {
    url: string;
    length: number;
  }
}
