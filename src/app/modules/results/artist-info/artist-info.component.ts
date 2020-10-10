import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArtistService } from '../../../services/artist.service';
import { map } from 'rxjs/operators';
import { Artist } from '../../../models/artist';
import { LoadingService } from '../../../services/loading.service';

@Component({
  selector: 'app-artist-info',
  templateUrl: './artist-info.component.html',
  styleUrls: ['./artist-info.component.scss']
})
export class ArtistInfoComponent implements OnInit {

  artistInfo: Artist;

  constructor(private artistService: ArtistService, private route: ActivatedRoute, public loading: LoadingService) {
    this.getArtistInfo();
  }

  ngOnInit(): void {
  }

  getArtistInfo(): void {
    setTimeout(() => this.route.params.pipe(map(params => params['id'])).subscribe((id: string) => {
      this.artistService.getArtist(id).subscribe(artist => {
        this.artistInfo = artist;
        this.loading.finishLoading();
        console.log(artist);
      })
     }), 2500)
  }
}
