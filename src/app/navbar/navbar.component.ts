import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map, isEmpty } from 'rxjs/operators';
import { SearchService } from '../services/search.service';
import { Result, TrackResult, FirebaseAlbumResult, FirebaseArtistResult, FirebaseTrackResult } from '../models/result';
import { LoadingService } from '../services/loading.service';
import { FirebaseService } from '../services/firebase.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  queryCtrl = new FormControl();
  filteredResults: Observable<Result[]>;
  filteredTracks: Observable<TrackResult[]>;
  firebaseArtistResults: FirebaseArtistResult[] = [];
  firebaseAlbumResults: FirebaseAlbumResult[] = [];
  firebaseTrackResults: FirebaseTrackResult[] = [];

  results: Result[] = [];
  trackResults: TrackResult[] = [];

  constructor(private searchService: SearchService, private firebaseSearch: FirebaseService, public loading: LoadingService) {
    this.filteredResults = this.queryCtrl.valueChanges
      .pipe(
        startWith(''),
        map(result => result ? this._filterResults(result) : this.results.slice())
      );
    this.filteredTracks =  this.queryCtrl.valueChanges
    .pipe(
      startWith(''),
      map(track => track ? this._filterTracks(track) : this.trackResults.slice())
    );
  }

  ngOnInit(): void { }

  private _filterResults(value: string): Result[] {
    const filterValue = value.toLowerCase();

    return this.results.filter(result => result.name.toLowerCase().indexOf(filterValue) === 0);
  }

  private _filterTracks(value: string): TrackResult[] {
    const filterValue = value.toLowerCase();

    return this.trackResults.filter(track => track.result.full_title.toLowerCase().indexOf(filterValue) === 0);
  }

  searchQuery(){
    this.firebaseQuery();
    if(this.firebaseQuery() === false) {
      this.spotifyQuery();
      this.geniusSearchQuery();
    } else {
      this.results = [];
      this.trackResults = [];
    }
  }

  spotifyQuery(){
    this.searchService.searchQuery(this.queryCtrl.value).subscribe(res => {
      res.artists.items = [...res.artists.items, ...res.albums.items];
      this.results = res.artists.items;
    });
  }
  geniusSearchQuery(){
    this.searchService.geniusSearch(this.queryCtrl.value).subscribe(res => {
      this.trackResults = res.response.hits;
    })
  }

  firebaseQuery(){
    let dataFetched: boolean = false;
    this.firebaseSearch.firebaseArtistSearch(this.queryCtrl.value).subscribe(res => {
      this.firebaseArtistResults = res;
    });
    this.firebaseSearch.firebaseAlbumSearch(this.queryCtrl.value).subscribe(res => {
      this.firebaseAlbumResults = res;
    });
    this.firebaseSearch.firebaseTrackSearch(this.queryCtrl.value).subscribe(res => {
      this.firebaseTrackResults = res;
    });
    (this.firebaseArtistResults.length === 0 && this.firebaseAlbumResults.length === 0 && this.firebaseTrackResults.length === 0) ? dataFetched = false : dataFetched = true;
    return dataFetched;
  }
}
