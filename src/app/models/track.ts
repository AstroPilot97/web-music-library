import { CloseScrollStrategyConfig } from '@angular/cdk/overlay/scroll/close-scroll-strategy';

export interface Track {
  description: {
    plain: string;
  }
  full_title: string;
  title: string;
  song_art_image_url: string;
  primary_artist: {
    image_url: string;
    name: string;
  }
  media: {
    provider: string;
    type: string;
    url: string;
  }
  recording_location: string;
  release_date_for_display: string;
  producer_artists: {
    name: string;
    image_url: string;
  }
  writer_artists: {
    name: string;
    image_url: string;
  }
}
