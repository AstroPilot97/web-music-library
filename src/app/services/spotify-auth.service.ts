import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class SpotifyAuthService {

  clientId = environment.spotify_clientId;
  clientSecret = environment.spotify_clientSecret;

  constructor(private http: HttpClient) { }

  login() {
    const authorizationTokenUrl = `https://accounts.spotify.com/api/token`;
    const body = 'grant_type=client_credentials';
    return this.http.post(authorizationTokenUrl, body, {
        headers: new HttpHeaders({
            Authorization:
                'Basic  ' + btoa(this.clientId + ':' + this.clientSecret),
            'Content-Type': 'application/x-www-form-urlencoded;',
        }),
    });
}
}
