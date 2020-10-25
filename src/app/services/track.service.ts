import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TrackService {

  private searchUrl: string;

  constructor(private http: HttpClient) { }

  getTrackInfo(id: string): Observable<any>{
    this.searchUrl = `https://api.genius.com/songs/${id}?text_format=plain&access_token=${environment.genius_apiKey}`;
    return this.http.get(this.searchUrl);
  }

  getTrackLyrics(artist: string, song: string): Observable<any>{
    this.searchUrl = `http://api.chartlyrics.com/apiv1.asmx/SearchLyricDirect?artist=${artist}&song=${song}`;
    return this.http.get(this.searchUrl);
  }
}
