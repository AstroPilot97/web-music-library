import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ResultsRoutingModule } from './results-routing.module';
import { ArtistInfoComponent } from './artist-info/artist-info.component';
import { AlbumInfoComponent } from './album-info/album-info.component';
import { ArtistService } from '../../services/artist.service';
import { NgxLoadingModule } from 'ngx-loading';


@NgModule({
  declarations: [ArtistInfoComponent, AlbumInfoComponent],
  imports: [
    CommonModule,
    ResultsRoutingModule,
    NgxLoadingModule
  ],
  providers: [ArtistService]
})
export class ResultsModule { }
