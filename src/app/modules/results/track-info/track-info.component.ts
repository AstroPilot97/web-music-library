import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { TrackService } from '../../../services/track.service';
import { Track } from 'src/app/models/track';
import { LoadingService } from '../../../services/loading.service';
import { TrackLyrics, SpotifyTrack, TrackFeatures } from '../../../models/track';
import { FirebaseService } from '../../../services/firebase.service';

@Component({
  selector: 'app-track-info',
  templateUrl: './track-info.component.html',
  styleUrls: ['./track-info.component.scss']
})
export class TrackInfoComponent implements OnInit {

  trackId: string;
  trackInfo: Track;
  spotifyResults: SpotifyTrack[];
  spotifyTrack: SpotifyTrack;
  trackFeatures: TrackFeatures;
  lyricsInfo: TrackLyrics;
  videoId: string;
  trackTime: string;

  constructor(private route: ActivatedRoute, private firebaseService: FirebaseService, private webTitle: Title, private trackService: TrackService, public loading: LoadingService) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      this.trackId = paramMap.get('id');
      this.getInfo();
    });
  }

  getInfo(): void{
    this.loading.isLoading = true;
    this.firebaseService.getTrack(this.trackId).subscribe(track => {
      if(track !==  null){
        this.trackInfo = track.trackInfo;
        this.spotifyTrack = track.spotifyTrack;
        this.trackFeatures = track.trackFeatures;
        this.trackService.getTrackLyrics(this.trackInfo.primary_artist.name, this.trackInfo.title).subscribe(res => {
          this.lyricsInfo = res.result;
        });
        try{
          this.pullIdFromVideoUrl();
        }
        catch(error)
        {
          console.error(error);
        }
        this.formatTrackTime();
        this.webTitle.setTitle(`${this.trackInfo.title}'s page`);
        this.loading.finishLoading();
        return;
      } else {
        setTimeout(() => {
          this.loading.startLoading();
          this.trackService.getTrackInfo(this.trackId).subscribe(res => {
            this.trackInfo = res.response.song;
            this.trackService.getSpotifyTrackInfo(`${this.trackInfo.title} ${this.trackInfo.primary_artist.name}`).subscribe(res => {
              this.spotifyResults = res.tracks.items;
              this.spotifyTrack = this.spotifyResults[0];
              this.trackService.getSpotifyTrackFeatures(`${this.spotifyTrack.id}`).subscribe(res => {
                this.trackFeatures = res;
                this.trackService.getTrackLyrics(this.trackInfo.primary_artist.name, this.trackInfo.title).subscribe(res => {
                  this.lyricsInfo = res.result;
                });
                this.saveTrackInfo();
                try{
                  this.pullIdFromVideoUrl();
                }
                catch(error)
                {
                  console.error(error);
                }
                this.formatTrackTime();
              });
            });
            this.loading.finishLoading();
            this.webTitle.setTitle(`${this.trackInfo.title} page`);
          })
        }, 2500);
      }
    });
  }

  pullIdFromVideoUrl(){
   const media = this.trackInfo.media.find(media => media.type === 'video');
   const lastEqualSignIndex = media.url.lastIndexOf('=');
   this.videoId = media.url.substr(lastEqualSignIndex + 1);
  }

  formatTrackTime(){
    let seconds = this.trackFeatures.duration_ms / 1000;
    let minutes = seconds / 60;

    seconds = Math.floor(seconds) % 60;
    minutes = Math.floor(minutes) % 60;
    let stringMinutes = minutes.toLocaleString();
    let stringSeconds = seconds.toLocaleString();
    if(seconds.toString().length < 2){
      stringSeconds = '0' + stringSeconds;
    }
    this.trackTime =`${stringMinutes}:${stringSeconds}`;
  }

  saveTrackInfo(){
    const trackInfo = {
      trackInfo: this.trackInfo,
      spotifyTrack: this.spotifyTrack,
      trackFeatures: this.trackFeatures
    };
    this.firebaseService.saveTrackData(this.trackId, trackInfo);
  }

}
