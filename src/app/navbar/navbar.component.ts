import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { SearchService } from '../services/search.service';
import { Result } from '../models/result';
import { LoadingService } from '../services/loading.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  queryCtrl = new FormControl();
  filteredResults: Observable<Result[]>;

  results: Result[] = [];

  constructor(private searchService: SearchService, public loading: LoadingService) {
    this.filteredResults = this.queryCtrl.valueChanges
      .pipe(
        startWith(''),
        map(result => result ? this._filterResults(result) : this.results.slice())
      );
  }
  ngOnInit(): void {
  }

  private _filterResults(value: string): Result[] {
    const filterValue = value.toLowerCase();

    return this.results.filter(result => result.name.toLowerCase().indexOf(filterValue) === 0);
  }

  searchQuery(){
    this.searchService.searchQuery(this.queryCtrl.value).subscribe(res => {
      res.artists.items = [...res.artists.items, ...res.albums.items];
      this.results = res.artists.items;
      console.log(res.artists.items);
    });
  }

}
