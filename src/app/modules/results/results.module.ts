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
import { AlbumService } from 'src/app/services/album.service';
import { TrackInfoComponent } from './track-info/track-info.component';
import { TrackService } from '../../services/track.service';
import { NgxYoutubePlayerModule } from 'ngx-youtube-player';
import { SafePipe } from './safe.pipe';

@NgModule({
  declarations: [ArtistInfoComponent, AlbumInfoComponent, TrackInfoComponent, SafePipe],
  imports: [
    CommonModule,
    ResultsRoutingModule,
    NgxLoadingModule,
    MatChipsModule,
    MatProgressBarModule,
    MatTooltipModule,
    NgxYoutubePlayerModule,
  ],
  providers: [ArtistService, AlbumService, TrackService]
})
export class ResultsModule { }
