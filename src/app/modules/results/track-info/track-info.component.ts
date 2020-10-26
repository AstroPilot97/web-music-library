import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { TrackService } from '../../../services/track.service';
import { Track } from 'src/app/models/track';
import { LoadingService } from '../../../services/loading.service';
import { TrackLyrics, SpotifyTrack } from '../../../models/track';
import { mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-track-info',
  templateUrl: './track-info.component.html',
  styleUrls: ['./track-info.component.scss']
})
export class TrackInfoComponent implements OnInit {

  trackName: string;
  trackId: string;
  trackInfo: Track;
  spotifyResults: SpotifyTrack[];
  spotifyTrack: SpotifyTrack;
  lyricsInfo: TrackLyrics;
  videoId: string;

  constructor(private route: ActivatedRoute, private webTitle: Title, private trackService: TrackService, public loading: LoadingService) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      this.trackName = paramMap.get('title');
      this.trackId = paramMap.get('id');
      this.webTitle.setTitle(`${this.trackName} page`);
      this.getInfo();
    });
  }

  getInfo(){
    this.loading.startLoading();
    setTimeout(() => {
      this.trackService.getTrackInfo(this.trackId).subscribe(res => {
        this.trackInfo = res.response.song;
        this.lyricsInfo = null;
        this.spotifyTrack = null;
        this.getSongLyrics();
        this.pullIdFromVideoUrl();
        this.trackService.getSpotifyTrackInfo(this.trackName).subscribe(res => {
          this.spotifyResults = res.tracks.items;
          this.spotifyResults.forEach((track) => {
            if(track.artists.find(artist => artist.name === this.trackInfo.primary_artist.name)){
              if(track.name === this.trackInfo.title){
                this.spotifyTrack = track;
                console.log(this.spotifyTrack);
              }
            }
          })
        })
        this.loading.finishLoading();
      })
    }, 2500)
  }

  pullIdFromVideoUrl(){
   const media = this.trackInfo.media.find(media => media.type === 'video');
   const lastEqualSignIndex = media.url.lastIndexOf('=');
   this.videoId = media.url.substr(lastEqualSignIndex + 1);
  }

  getSongLyrics() {
    this.trackService.getTrackLyrics(this.trackInfo.primary_artist.name, this.trackName).subscribe(res => {
      this.lyricsInfo = res.result;
    })
  }

}
