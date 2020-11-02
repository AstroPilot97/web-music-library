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

  artistId: string;
  spotifyArtistInfo: SpotifyArtist;
  similarArtists: SimilarArtist;
  lastfmArtistInfo: LastFMArtist;
  artistAlbums: ArtistAlbums;
  isExpanded: boolean = false;

  constructor(private artistService: ArtistService, private route: ActivatedRoute, public loading: LoadingService, private webTitle: Title) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      this.artistId = paramMap.get('id');
      this.getArtistInfo();
    });
  }

  getArtistInfo(): void {
    this.loading.startLoading()
    setTimeout(() => forkJoin([this.artistService.getArtist(this.artistId), this.artistService.getSimilarArtists(this.artistId), this.artistService.getArtistAlbums(this.artistId)])
      .subscribe(results => {
        this.spotifyArtistInfo = results[0];
        this.similarArtists = results[1];
        this.artistAlbums = results[2].items.filter((album, index, self) =>
          index === self.findIndex((a) => (
            a.name === album.name
          ))
        );
        this.getLastFMArtistInfo();
        this.loading.finishLoading();
        this.webTitle.setTitle(`${this.spotifyArtistInfo.name}'s page`)
      }), 2500)
  }

  getLastFMArtistInfo(){
    this.artistService.getlastfmArtist(this.spotifyArtistInfo.name).subscribe(res => {
      this.lastfmArtistInfo = res;
    });
  }

  showFullInfo(){
    if(this.isExpanded === false){
      this.isExpanded = true;
    }
    else {
      this.isExpanded = false;
    }
  }
}
