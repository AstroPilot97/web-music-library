import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/database';
import { LastFMArtist, SimilarArtist, ArtistAlbums, SpotifyArtist } from '../models/artist';
import { Result } from '../models/result';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  private artistsPath = '/artists/';

  artistRef: AngularFireObject<any>;

  constructor(private db: AngularFireDatabase) {
  }

  getArtist(id: string): Observable<any>{
    return this.db.object(`${this.artistsPath}${id}`).valueChanges();
  }

  saveArtistData(id, artist): any {
    this.artistRef = this.db.object(`${this.artistsPath}${id}`);
    this.artistRef.set(artist);
  }
}
