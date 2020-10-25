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

  getTrackLyrics(artist: string, track: string): Observable<any>{
    this.searchUrl = `https://orion.apiseeds.com/api/music/lyric/${artist}/${track}?apikey=${environment.lyrics_apiKey}`;
    return this.http.get(this.searchUrl);
  }
}
