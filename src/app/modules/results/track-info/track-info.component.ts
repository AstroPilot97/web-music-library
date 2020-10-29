import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { TrackService } from '../../../services/track.service';
import { Track } from 'src/app/models/track';
import { LoadingService } from '../../../services/loading.service';
import { TrackLyrics, SpotifyTrack, TrackFeatures } from '../../../models/track';

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
  trackFeatures: TrackFeatures;
  lyricsInfo: TrackLyrics;
  videoId: string;
  trackTime: string;

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
    this.trackInfo = null;
    this.lyricsInfo = null;
    this.spotifyResults = null;
    this.spotifyTrack = null;
    setTimeout(() => {
      this.trackService.getTrackInfo(this.trackId).subscribe(res => {
        this.trackInfo = res.response.song;
        this.getSongLyrics();
        this.pullIdFromVideoUrl();
        this.trackService.getSpotifyTrackInfo(`${this.trackName} ${this.trackInfo.primary_artist.name}`).subscribe(res => {
          this.spotifyResults = res.tracks.items;
          this.spotifyTrack = this.spotifyResults[0];
          this.getAudioFeatures();
        });
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

  getAudioFeatures(){
    this.trackService.getSpotifyTrackFeatures(`${this.spotifyTrack.id}`).subscribe(res => {
      this.trackFeatures = res;
      this.formatTrackTime();
    });
  }

  formatTrackTime(){
    let seconds = this.trackFeatures.duration_ms / 1000;
    let minutes = seconds / 60;

    seconds = Math.floor(seconds) % 60;
    minutes = Math.floor(minutes) % 60;

    this.trackTime = `${minutes}:${seconds}`;
    console.log(this.trackTime);
  }

}
