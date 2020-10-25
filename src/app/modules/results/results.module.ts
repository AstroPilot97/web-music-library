import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ResultsRoutingModule } from './results-routing.module';
import { ArtistInfoComponent } from './artist-info/artist-info.component';
import { AlbumInfoComponent } from './album-info/album-info.component';
import { ArtistService } from '../../services/artist.service';
import { NgxLoadingModule } from 'ngx-loading';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgAnimatedCounterModule } from '@bugsplat/ng-animated-counter'
import { AlbumService } from '../../services/album.service';

@NgModule({
  declarations: [ArtistInfoComponent, AlbumInfoComponent],
  imports: [
    CommonModule,
    ResultsRoutingModule,
    NgxLoadingModule,
    MatChipsModule,
    MatProgressBarModule,
    MatTooltipModule,
    NgAnimatedCounterModule
  ],
  providers: [ArtistService, AlbumService]
})
export class ResultsModule { }
