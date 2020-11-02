import { Component, OnInit } from '@angular/core';
import { AlbumService } from '../../../services/album.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { LoadingService } from '../../../services/loading.service';
import { Album } from 'src/app/models/album';
import { map } from 'rxjs/operators';
import { Title } from '@angular/platform-browser';
import { SpotifyArtist } from '../../../models/artist';

@Component({
  selector: 'app-album-info',
  templateUrl: './album-info.component.html',
  styleUrls: ['./album-info.component.scss']
})
export class AlbumInfoComponent implements OnInit {

  albumId: string;
  albumInfo: Album;
  artistInfo: SpotifyArtist;
  tableHeaders = ["number", "name", "length"];

  constructor(private albumService: AlbumService, private route: ActivatedRoute, public loading: LoadingService, private webTitle: Title ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      this.albumId = paramMap.get('id');
      this.getAlbumInfo();
    });
  }

  getAlbumInfo(): void {
    this.loading.startLoading();
    setTimeout(() => this.route.params.pipe(map(params => params['id'])).subscribe((id: string) => {
      this.albumService.getAlbum(id).subscribe(album => {
        this.albumInfo = album;
        console.log(album);
        this.loading.finishLoading();
        this.getAlbumArtist();
        this.getTrackTimes();
        this.webTitle.setTitle(`${this.albumInfo.name} page`);
      });
     }), 2500)
  }

  getAlbumArtist(){
    this.albumService.getArtist(this.albumInfo.artists[0].id).subscribe(res => {
      this.artistInfo = res;
    })
  }

  getTrackTimes(){
    this.albumInfo.tracks.items.forEach(track => {
      let seconds = track.duration_ms / 1000;
      let minutes = seconds / 60;

      seconds = Math.floor(seconds) % 60;
      minutes = Math.floor(minutes) % 60;
      track.trackTime =`${minutes}:${seconds}`;
    });
  }
}
