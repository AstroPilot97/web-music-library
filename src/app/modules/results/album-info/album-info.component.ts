import { Component, OnInit } from '@angular/core';
import { AlbumService } from '../../../services/album.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { LoadingService } from '../../../services/loading.service';
import { Album } from 'src/app/models/album';
import { map } from 'rxjs/operators';
import { Title } from '@angular/platform-browser';
import { SpotifyArtist } from '../../../models/artist';
import { FirebaseService } from '../../../services/firebase.service';
import { SearchService } from '../../../services/search.service';

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

  constructor(private albumService: AlbumService, private searchService: SearchService ,private firebaseService: FirebaseService, private route: ActivatedRoute, private router: Router, public loading: LoadingService, private webTitle: Title ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      this.albumId = paramMap.get('id');
      this.getAlbumInfo();
    });
  }

  getAlbumInfo(): void {
    this.loading.startLoading();
    this.firebaseService.getAlbum(this.albumId).subscribe(album => {
      if(album !==  null){
        this.albumInfo = album.albumInfo;
        this.artistInfo = album.artistInfo;
        this.getTrackTimes();
        this.webTitle.setTitle(`${this.albumInfo.name}'s page`);
        this.loading.finishLoading();
        return;
      } else {
        this.loading.startLoading();
        setTimeout(() => this.route.params.pipe(map(params => params['id'])).subscribe((id: string) => {
          this.albumService.getAlbum(id).subscribe(album => {
            this.albumInfo = album;
            this.albumService.getArtist(this.albumInfo.artists[0].id).subscribe(res => {
              this.artistInfo = res;
              this.saveAlbumInfo();
            })
            this.loading.finishLoading();
            this.getTrackTimes();
            this.webTitle.setTitle(`${this.albumInfo.name} page`);
          });
         }), 2500);
      }
    });
  }

  saveAlbumInfo(){
    const albumInfo = {
      albumInfo: this.albumInfo,
      artistInfo: this.artistInfo,
    };
    this.firebaseService.saveAlbumData(this.albumId, albumInfo);
  }

  getTrackTimes(){
    this.albumInfo.tracks.items.forEach(track => {
      let seconds = track.duration_ms / 1000;
      let minutes = seconds / 60;

      seconds = Math.floor(seconds) % 60;
      minutes = Math.floor(minutes) % 60;
      let stringMinutes = minutes.toLocaleString();
      let stringSeconds = seconds.toLocaleString();
      if(seconds.toString().length < 2){
        stringSeconds = '0' + stringSeconds;
      }
      track.trackTime =`${stringMinutes}:${stringSeconds}`;
    });
  }

  getTrack(trackName: string, trackArtist: string){
    const query = `${trackName} ${trackArtist}`;
    let trackId = null;
    this.searchService.geniusSearch(query).subscribe(results => {
      trackId = results.response.hits[0].result.id;
      this.router.navigateByUrl(`/results/track/${trackId}`);
    })
  }
}
