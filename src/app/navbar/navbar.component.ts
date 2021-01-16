import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { SearchService } from '../services/search.service';
import { Result, TrackResult, FirebaseAlbumResult, FirebaseArtistResult, FirebaseTrackResult } from '../models/result';
import { HostListener } from "@angular/core"
import { ngxLoadingAnimationTypes } from 'ngx-loading';
import { LoadingService } from '../services/loading.service';
import { FirebaseService } from '../services/firebase.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})

export class NavbarComponent implements OnInit {
  screenWidth: number;
  public queryCtrl = new FormControl();
  searching: boolean = false;
  animation = ngxLoadingAnimationTypes;
  filteredResults: Observable<Result[]>;
  filteredTracks: Observable<TrackResult[]>;
  firebaseArtistResults: FirebaseArtistResult[] = [];
  firebaseAlbumResults: FirebaseAlbumResult[] = [];
  firebaseTrackResults: FirebaseTrackResult[] = [];

  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.screenWidth = window.innerWidth;
  }

  results: Result[] = [];
  trackResults: TrackResult[] = [];

  constructor(private searchService: SearchService, private firebaseSearch: FirebaseService, private router: Router, public loading: LoadingService) {
    this.onResize();
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
    this.searching = true;
    if(this.screenWidth >= 1200){
      this.firebaseQuery();
      if(this.firebaseQuery() === false) {
        this.spotifyQuery();
        this.geniusSearchQuery();
      } else {
        this.results = [];
        this.trackResults = [];
      }
      this.searching = false;
    } else {
      setTimeout(() => {
        this.firebaseQuery();
        if(this.firebaseQuery() === false) {
          this.spotifyQuery();
          this.geniusSearchQuery();
        } else {
          this.results = [];
          this.trackResults = [];
        }
        this.searching = false;
      }, 2000);
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

  navigateToSearch(){
    this.searchService.passQueryString(this.queryCtrl.value);
  }
}
