import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ArtistService } from '../../../services/artist.service';
import { SpotifyArtist, LastFMArtist, SimilarArtist, ArtistAlbums } from '../../../models/artist';
import { LoadingService } from '../../../services/loading.service';
import { Title } from '@angular/platform-browser';
import { forkJoin } from 'rxjs';
import { FirebaseService } from '../../../services/firebase.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-artist-info',
  templateUrl: './artist-info.component.html',
  styleUrls: ['./artist-info.component.scss']
})
export class ArtistInfoComponent implements OnInit {

  artistId: string;
  spotifyArtistInfo: SpotifyArtist;
  similarArtists: SimilarArtist;
  lastfmArtistInfo: LastFMArtist;
  artistAlbums: ArtistAlbums;
  albumsFilter = {album_group: 'album'};
  singlesFilter = {album_group: 'single'};
  isExpanded: boolean = false;
  currentDate = new Date().toDateString();
  dateFlag: boolean;

  constructor(private artistService: ArtistService, private route: ActivatedRoute, private firebaseService: FirebaseService, public loading: LoadingService, private webTitle: Title, private datePipe: DatePipe) {
    this.currentDate = this.datePipe.transform(this.currentDate, 'yyyy-MM-dd');
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      this.artistId = paramMap.get('id');
      this.getArtistInfo();
    });
  }

  getArtistInfo(): void {
    this.loading.startLoading();
    this.firebaseService.getArtist(this.artistId).subscribe(artist => {
      if(artist){
        this.timestampCheck(this.currentDate, artist.dateSaved);
        if(this.dateFlag === false){
          this.spotifyArtistInfo = artist.spotifyArtistInfo;
          this.similarArtists = artist.similarArtists;
          this.artistAlbums = artist.artistAlbums;
          this.lastfmArtistInfo = artist.lastfmArtistInfo;
          this.webTitle.setTitle(`${this.spotifyArtistInfo.name}'s page`);
          this.loading.finishLoading();
        } else {
          this.getApiInfo();
        }
      } else {
        this.getApiInfo();
      }
    });
  }

  saveArtist(){
    const artistInfo = {
      spotifyArtistInfo: this.spotifyArtistInfo,
      similarArtists: this.similarArtists,
      artistAlbums: this.artistAlbums,
      lastfmArtistInfo: this.lastfmArtistInfo,
      dateSaved: this.currentDate
    };
    this.firebaseService.saveArtistData(this.artistId, artistInfo);
  }

  showFullInfo(){
    if(this.isExpanded === false){
      this.isExpanded = true;
    }
    else {
      this.isExpanded = false;
    }
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

  getApiInfo(){
    setTimeout(() => forkJoin([this.artistService.getArtist(this.artistId), this.artistService.getSimilarArtists(this.artistId), this.artistService.getArtistAlbums(this.artistId)])
    .subscribe(results => {
      this.spotifyArtistInfo = results[0];
      this.similarArtists = results[1];
      this.artistAlbums = results[2].items.filter((album, index, self) =>
        index === self.findIndex((a) => (
          a.name === album.name
        ))
      );
      this.artistService.getlastfmArtist(this.spotifyArtistInfo.name).subscribe(res => {
        delete res.artist.image;
        delete res.artist.similar;
        delete res.artist.bio.links;
        this.lastfmArtistInfo = res;
        this.saveArtist();
      });
      this.webTitle.setTitle(`${this.spotifyArtistInfo.name}'s page`);
      this.loading.finishLoading();
    }), 2000);
  }
}
