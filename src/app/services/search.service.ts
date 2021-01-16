import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { SpotifyAuthService } from './spotify-auth.service';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class SearchService {
  public query: string = null;
  private searchUrl: string;
  private accessToken: string;
  private tokenType: string;
  private querySource = new BehaviorSubject(this.query);
  currentQuery = this.querySource.asObservable();

  constructor(private http: HttpClient, private spotifyAuth: SpotifyAuthService) {
    this.spotifyAuth.login().subscribe(data => {
      this.accessToken = data['access_token'];
      this.tokenType = data['token_type'];
     });
   }

  searchQuery(query: string): Observable<any>{
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        Authorization: `${this.tokenType} ${this.accessToken}`
      })
    };
    this.searchUrl = `https://api.spotify.com/v1/search?query=${query}&offset=0&limit=2&type=artist,album`;
    return this.http.get(this.searchUrl, httpOptions);
  }

  resultsQuery(query: string): Observable<any>{
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        Authorization: `${this.tokenType} ${this.accessToken}`
      })
    };
    this.searchUrl = `https://api.spotify.com/v1/search?query=${query}&offset=0&limit=5&type=artist,album`;
    return this.http.get(this.searchUrl, httpOptions);
  }

  geniusSearch(query: string): Observable<any>{
    this.searchUrl = `https://api.genius.com/search?q=${query}&access_token=${environment.genius_apiKey}`;
    return this.http.get(this.searchUrl);
  }

  passQueryString(queryString: string) {
    this.querySource.next(queryString);
  }
}
