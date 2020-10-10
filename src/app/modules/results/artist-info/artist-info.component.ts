import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ArtistService } from '../../../services/artist.service';
import { SpotifyArtist, LastFMArtist, SimilarArtist } from '../../../models/artist';
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

  constructor(private artistService: ArtistService, private route: ActivatedRoute, public loading: LoadingService, private webTitle: Title) {}

  ngOnInit(): void {
    console.log(this.loading.isLoading);
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      this.artistName = paramMap.get('name');
      this.artistId = paramMap.get('id');
      this.webTitle.setTitle(`${this.artistName} page`);
      this.getArtistInfo();
    });
  }

  getArtistInfo(): void {
    this.loading.startLoading()
    setTimeout(() => forkJoin([this.artistService.getArtist(this.artistId), this.artistService.getSimilarArtists(this.artistId), this.artistService.getlastfmArtist(this.artistName)])
      .subscribe(results => {
        this.spotifyArtistInfo = results[0];
        this.similarArtists = results[1];
        this.lastfmArtistInfo = results[2];
        console.log(this.spotifyArtistInfo);
        console.log(this.similarArtists);
        console.log(this.lastfmArtistInfo);
        this.loading.finishLoading();
      }), 2500)
  }
}
