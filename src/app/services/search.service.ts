import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SpotifyAuthService } from './spotify-auth.service';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private searchUrl: string;
  private accessToken: string;
  private tokenType: string;

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

    this.searchUrl = `https://api.spotify.com/v1/search?query=${query}&offset=0&limit=3&type=artist,album`;
    return this.http.get(this.searchUrl, httpOptions);
  }

  geniusSearch(query: string): Observable<any>{
    this.searchUrl = `https://api.genius.com/search?q=${query}&access_token=${environment.genius_apiKey}`;
    return this.http.get(this.searchUrl);
  }
}
