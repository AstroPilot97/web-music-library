import { Component, OnInit } from '@angular/core';
import { AlbumService } from '../../../services/album.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { LoadingService } from '../../../services/loading.service';
import { Album, LastFMAlbum } from 'src/app/models/album';
import { map } from 'rxjs/operators';
import { Title } from '@angular/platform-browser';
import { SpotifyArtist, LastFMArtist } from '../../../models/artist';
import { FirebaseService } from '../../../services/firebase.service';
import { SearchService } from '../../../services/search.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-album-info',
  templateUrl: './album-info.component.html',
  styleUrls: ['./album-info.component.scss']
})
export class AlbumInfoComponent implements OnInit {

  albumId: string;
  albumName: string;
  albumInfo: Album;
  artistInfo: SpotifyArtist;
  albumDesc: LastFMAlbum;
  isExpanded: boolean;
  tableHeaders = ["number", "name", "length"];
  currentDate = new Date().toDateString();
  dateFlag: boolean;

  constructor(private albumService: AlbumService, private searchService: SearchService, private firebaseService: FirebaseService, private route: ActivatedRoute,
    private router: Router, public loading: LoadingService, private webTitle: Title, private datePipe: DatePipe) {
    this.currentDate = this.datePipe.transform(this.currentDate, 'yyyy-MM-dd');
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      this.albumId = paramMap.get('id');
      this.getAlbumInfo();
    });
  }

  getAlbumInfo(): void {
    this.loading.startLoading();
    this.firebaseService.getAlbum(this.albumId).subscribe(album => {
      if(album){
        this.timestampCheck(this.currentDate, album.dateSaved);
        if(this.dateFlag === false){
          this.albumInfo = album.albumInfo;
          this.artistInfo = album.artistInfo;
          this.albumDesc = album.albumDesc;
          this.getTrackTimes();
          this.loading.finishLoading();
        } else {
          this.getApiInfo();
        }
      } else {
        this.getApiInfo();
      }
    });
  }

  saveAlbumInfo(){
    const albumInfo = {
      albumInfo: this.albumInfo,
      artistInfo: this.artistInfo,
      albumDesc: this.albumDesc,
      dateSaved: this.currentDate
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

  timestampCheck(currentDate, olderDate){
    this.dateFlag = false;
    var d1 = Date.parse(currentDate);
    var d2 = Date.parse(olderDate);
    if(d1 - d2 >= 7){
      this.dateFlag = true;
    }
    return this.dateFlag;
  }

  showFullInfo(){
    if(this.isExpanded === false){
      this.isExpanded = true;
    }
    else {
      this.isExpanded = false;
    }
  }

  //metoda na wyciąganie danych o albumach z serwisu albumService
  getApiInfo(){
    setTimeout(() => this.route.params.pipe(map(params => params['id'])).subscribe((id: string) => {
      //subskrypcja metody
      this.albumService.getAlbum(id).subscribe(album => {
        this.albumInfo = album; //interfejs Album
        //przekazanie ID artysty z danych albumu i pobieranie informacji o nim
        this.albumService.getArtist(this.albumInfo.artists[0].id).subscribe(res => {
          this.artistInfo = res; // interfejs SpotifyArtist
          this.albumService.getLastFMAlbum(this.albumInfo.name, this.artistInfo.name).subscribe(lastFMInfo => {
            delete lastFMInfo.album.image;
            delete lastFMInfo.album.tracks;
            this.albumDesc = lastFMInfo;
            this.saveAlbumInfo(); //zapis danych do bazy Firebase
          });
        })
        this.getTrackTimes();
        this.webTitle.setTitle(`${this.albumInfo.name} page`);
        this.loading.finishLoading();
      });
     }), 2000);
  }
}
