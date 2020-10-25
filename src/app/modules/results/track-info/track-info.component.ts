import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { TrackService } from '../../../services/track.service';
import { Track } from 'src/app/models/track';
import { LoadingService } from '../../../services/loading.service';
import { TrackLyrics } from '../../../models/track';

@Component({
  selector: 'app-track-info',
  templateUrl: './track-info.component.html',
  styleUrls: ['./track-info.component.scss']
})
export class TrackInfoComponent implements OnInit {

  trackName: string;
  trackId: string;
  trackInfo: Track;
  lyricsInfo: TrackLyrics;

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
        this.getSongLyrics();
        this.loading.finishLoading();
        console.log(this.trackInfo);
      })
    }, 2500)

  }
  getSongLyrics() {
    this.trackService.getTrackLyrics(this.trackInfo.primary_artist.name, this.trackName).subscribe(res => {
      this.lyricsInfo = res.result;
    })
  }

}
