import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SpotifyAuthService } from './spotify-auth.service';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AlbumService {
  //pola prywatne danych przesyłanych w zapytaniach
  private accessToken: string;
  private tokenType: string;
  private albumUrl: string;

  constructor(private http: HttpClient, private spotifyAuth: SpotifyAuthService) {
    //wywołanie metody login z serwisu spotify-auth do przekazywania tokenu
    this.spotifyAuth.login().subscribe(data => {
      this.accessToken = data['access_token'];
      this.tokenType = data['token_type'];
    });
   }

   getAlbum(id: string): Observable<any>{
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        Authorization: `${this.tokenType} ${this.accessToken}`
      })
    };
    //endpoint serwisu Spotify zwracający dane o albumie
    this.albumUrl = `https://api.spotify.com/v1/albums/${id}`;
    return this.http.get(this.albumUrl, httpOptions);
   }

   getLastFMAlbum(name: string, artist: string): Observable<any>{
    this.albumUrl = `http://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=${environment.lastfm_apiKey}&artist=${artist}&album=${name}&format=json`;
    return this.http.get(this.albumUrl);
   }

   getArtist(id: string): Observable<any>{
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        Authorization: `${this.tokenType} ${this.accessToken}`
      })
    };
    //endpoint serwisu Spotify zwracający dane o wykonawcy albumu
    this.albumUrl = `https://api.spotify.com/v1/artists/${id}`;
    return this.http.get(this.albumUrl, httpOptions);
  }
}
