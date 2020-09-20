import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArtistService } from '../../../services/artist.service';
import { map } from 'rxjs/operators';
import { Artist } from '../../../models/artist';

@Component({
  selector: 'app-artist-info',
  templateUrl: './artist-info.component.html',
  styleUrls: ['./artist-info.component.scss']
})
export class ArtistInfoComponent implements OnInit {

  artistInfo: Artist;

  constructor(private artistService: ArtistService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.pipe(map(params => params['id'])).subscribe((id: string) => {
      this.artistService.getArtist(id).subscribe(artist => {
        this.artistInfo = artist;
      })
     })
    }
  }
