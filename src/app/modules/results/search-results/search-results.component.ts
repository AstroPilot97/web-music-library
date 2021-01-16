import { Component, OnInit } from '@angular/core';
import { SearchService } from '../../../services/search.service';
import { Result, TrackResult } from '../../../models/result';
import { LoadingService } from '../../../services/loading.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss']
})
export class SearchResultsComponent implements OnInit {
  results: Result[];
  trackResults: TrackResult[];
  query: string;

  constructor(private searchService: SearchService, public loading: LoadingService, private router: Router) {
    this.search();
   }

  ngOnInit(): void {
  }

  search(){
    this.searchService.currentQuery.subscribe(query => {
      this.query = query;
    });
    if(this.query){
      this.searchService.resultsQuery(this.query).subscribe(res => {
        res.artists.items = [...res.artists.items, ...res.albums.items];
        this.results = res.artists.items;
      });
      this.searchService.geniusSearch(this.query).subscribe(res => {
        this.trackResults = res.response.hits;
      })
    } else {
      this.router.navigateByUrl("/home");
    }
    this.loading.finishLoading();
  }

}
