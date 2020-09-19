import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SpotifyAuthService } from './spotify-auth.service';
import { map } from 'rxjs/operators';
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

  searchQuery(query: string){
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        Authorization: `${this.tokenType} ${this.accessToken}`
      })
    };

    this.searchUrl = `https://api.spotify.com/v1/search?query=${query}&offset=0&limit=10&type=artist,album,track`;
    return this.http.get(this.searchUrl, httpOptions).pipe(map(res => console.log(res)));
  }
}
