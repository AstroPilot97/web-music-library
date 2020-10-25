import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SpotifyAuthService } from './spotify-auth.service';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ArtistService {
  private accessToken: string;
  private tokenType: string;
  private artistUrl: string;


  constructor(private http: HttpClient, private spotifyAuth: SpotifyAuthService) {
    this.spotifyAuth.login().subscribe(data => {
      this.accessToken = data['access_token'];
      this.tokenType = data['token_type'];
    });
  }

  getArtist(id: string): Observable<any>{
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        Authorization: `${this.tokenType} ${this.accessToken}`
      })
    };
    this.artistUrl = `https://api.spotify.com/v1/artists/${id}`;
    return this.http.get(this.artistUrl, httpOptions);
  }

  getSimilarArtists(id:string): Observable<any>{
    this.spotifyAuth.login().subscribe(data => {
      this.accessToken = data['access_token'];
      this.tokenType = data['token_type'];
    });
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        Authorization: `${this.tokenType} ${this.accessToken}`
      })
    };
    this.artistUrl = `https://api.spotify.com/v1/artists/${id}/related-artists`;
    return this.http.get(this.artistUrl, httpOptions);
  }

  getArtistAlbums(id:string): Observable<any>{
    this.spotifyAuth.login().subscribe(data => {
      this.accessToken = data['access_token'];
      this.tokenType = data['token_type'];
    });
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        Authorization: `${this.tokenType} ${this.accessToken}`
      })
    };
    this.artistUrl = `https://api.spotify.com/v1/artists/${id}/albums?market=US&include_groups=album&limit=50`;
    return this.http.get(this.artistUrl, httpOptions);
  }

  getlastfmArtist(name: string): Observable<any>{
    this.artistUrl = `https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${name}&api_key=${environment.lastfm_apiKey}&format=json`;
    return this.http.get(this.artistUrl);
  }
}
