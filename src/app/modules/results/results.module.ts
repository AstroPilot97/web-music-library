import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ResultsRoutingModule } from './results-routing.module';
import { ArtistInfoComponent } from './artist-info/artist-info.component';
import { AlbumInfoComponent } from './album-info/album-info.component';
import { ArtistService } from '../../services/artist.service';


@NgModule({
  declarations: [ArtistInfoComponent, AlbumInfoComponent],
  imports: [
    CommonModule,
    ResultsRoutingModule
  ],
  providers: [ArtistService]
})
export class ResultsModule { }
