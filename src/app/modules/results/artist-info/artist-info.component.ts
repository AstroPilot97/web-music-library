import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ArtistService } from '../../../services/artist.service';
import { SpotifyArtist, LastFMArtist, SimilarArtist, ArtistAlbums } from '../../../models/artist';
import { LoadingService } from '../../../services/loading.service';
import { Title } from '@angular/platform-browser';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-artist-info',
  templateUrl: './artist-info.component.html',
  styleUrls: ['./artist-info.component.scss']
})
export class ArtistInfoComponent implements OnInit {

  artistName: string;
  artistId: string;
  spotifyArtistInfo: SpotifyArtist;
  similarArtists: SimilarArtist;
  lastfmArtistInfo: LastFMArtist;
  artistAlbums: ArtistAlbums;
  constructor(private artistService: ArtistService, private route: ActivatedRoute, public loading: LoadingService, private webTitle: Title) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      this.artistName = paramMap.get('name');
      this.artistId = paramMap.get('id');
      this.webTitle.setTitle(`${this.artistName} page`);
      this.getArtistInfo();
    });
  }

  getArtistInfo(): void {
    this.loading.startLoading()
    setTimeout(() => forkJoin([this.artistService.getArtist(this.artistId), this.artistService.getSimilarArtists(this.artistId), this.artistService.getlastfmArtist(this.artistName), this.artistService.getArtistAlbums(this.artistId)])
      .subscribe(results => {
        this.spotifyArtistInfo = results[0];
        this.similarArtists = results[1];
        this.lastfmArtistInfo = results[2];
        this.artistAlbums = results[3].items.filter((album, index, self) =>
          index === self.findIndex((a) => (
            a.name === album.name
          ))
        );
        console.log(this.artistAlbums);
        this.loading.finishLoading();
      }), 2500)
  }
}
