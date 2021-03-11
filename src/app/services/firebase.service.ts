import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireObject } from '@angular/fire/database';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  private artistsPath = '/artists/'; //ścieżka dla artystów
  private albumsPath = '/albums/';  //ścieżka dla albumów
  private tracksPath = '/tracks/';  //ścieżka dla utworów
  //referencje obiektów JSON w chmurowej bazie
  artistRef: AngularFireObject<any>;
  albumsRef: AngularFireObject<any>;
  tracksRef: AngularFireObject<any>;

  constructor(private db: AngularFireDatabase) {
  }
  //metoda na wyciąganie obiektu artysty
  getArtist(id: string): Observable<any>{
    return this.db.object(`${this.artistsPath}${id}`).valueChanges();
  }
  //metoda na zapisywanie nowego artysty do bazy
  saveArtistData(id, artist): any {
    this.artistRef = this.db.object(`${this.artistsPath}${id}`);
    this.artistRef.set(artist);
  }
  //metoda na wyciąganie obiektu albumu
  getAlbum(id: string): Observable<any>{
    return this.db.object(`${this.albumsPath}${id}`).valueChanges();
  }
  //metoda na zapisywanie nowego albumu do bazy
  saveAlbumData(id, album): any {
    this.albumsRef = this.db.object(`${this.albumsPath}${id}`);
    this.albumsRef.set(album);
  }
  //metoda na wyciąganie obiektu utworu
  getTrack(id: string): Observable<any>{
    return this.db.object(`${this.tracksPath}${id}`).valueChanges();
  }
  //metoda na zapisywanie nowego obiektu utworu do bazy
  saveTrackData(id, track): any {
    this.albumsRef = this.db.object(`${this.tracksPath}${id}`);
    this.albumsRef.set(track);
  }

  firebaseArtistSearch(query: string): Observable<any> {
    let results = this.db.list(this.artistsPath, ref => ref.orderByChild('spotifyArtistInfo/name').startAt(query).endAt(query+"\uf8ff")
    ).valueChanges();
    return results;
  }

  firebaseAlbumSearch(query: string): Observable<any> {
    let results = this.db.list(this.albumsPath, ref => ref.orderByChild('albumInfo/name').startAt(query).endAt(query+"\uf8ff")
    ).valueChanges();
    return results;
  }

  firebaseTrackSearch(query: string): Observable<any> {
    let results = this.db.list(this.tracksPath, ref => ref.orderByChild('trackInfo/full_title').startAt(query).endAt(query+"\uf8ff")
    ).valueChanges();
    return results;
  }
}
