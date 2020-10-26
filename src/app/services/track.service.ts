import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SpotifyAuthService } from './spotify-auth.service';

@Injectable({
  providedIn: 'root'
})
export class TrackService {

  private searchUrl: string;
  private accessToken: string;
  private tokenType: string;

  constructor(private http: HttpClient, private spotifyAuth: SpotifyAuthService) {
    this.spotifyAuth.login().subscribe(data => {
      this.accessToken = data['access_token'];
      this.tokenType = data['token_type'];
     });
   }

  getTrackInfo(id: string): Observable<any>{
    this.searchUrl = `https://api.genius.com/songs/${id}?text_format=plain&access_token=${environment.genius_apiKey}`;
    return this.http.get(this.searchUrl);
  }

  getTrackLyrics(artist: string, track: string): Observable<any>{
    this.searchUrl = `https://orion.apiseeds.com/api/music/lyric/${artist}/${track}?apikey=${environment.lyrics_apiKey}`;
    return this.http.get(this.searchUrl);
  }

  getSpotifyTrackInfo(query: string): Observable<any>{
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        Authorization: `${this.tokenType} ${this.accessToken}`
      })
    };
    this.searchUrl = `https://api.spotify.com/v1/search?q=${query}&type=track&limit=1`;
    return this.http.get(this.searchUrl, httpOptions);
  }
}
