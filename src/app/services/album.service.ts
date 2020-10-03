import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SpotifyAuthService } from './spotify-auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlbumService {
  private accessToken: string;
  private tokenType: string;
  private albumUrl: string;

  constructor(private http: HttpClient, private spotifyAuth: SpotifyAuthService) {
    this.spotifyAuth.login().subscribe(data => {
      this.accessToken = data['access_token'];
      this.tokenType = data['token_type'];
      console.log(`Artist service: ${data}`);
    });
   }

   getAlbum(id: string): Observable<any>{
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        Authorization: `${this.tokenType} ${this.accessToken}`
      })
    };
    this.albumUrl = `https://api.spotify.com/v1/albums/${id}`;
    return this.http.get(this.albumUrl, httpOptions);
   }
}
