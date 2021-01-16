import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ResultsRoutingModule } from './results-routing.module';
import { ArtistInfoComponent } from './artist-info/artist-info.component';
import { AlbumInfoComponent } from './album-info/album-info.component';
import { ArtistService } from '../../services/artist.service';
import { NgxLoadingModule } from 'ngx-loading';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTableModule } from '@angular/material/table';
import { AlbumService } from 'src/app/services/album.service';
import { TrackInfoComponent } from './track-info/track-info.component';
import { TrackService } from '../../services/track.service';
import { NgxYoutubePlayerModule } from 'ngx-youtube-player';
import { SafePipe } from './safe.pipe';
import { NgPipesModule } from 'ngx-pipes';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { SearchResultsComponent } from './search-results/search-results.component';

@NgModule({
  declarations: [ArtistInfoComponent, AlbumInfoComponent, TrackInfoComponent, SafePipe, SearchResultsComponent],
  imports: [
    CommonModule,
    ResultsRoutingModule,
    NgxLoadingModule,
    MatChipsModule,
    MatButtonModule,
    MatProgressBarModule,
    MatTooltipModule,
    NgxYoutubePlayerModule,
    NgPipesModule,
    MatTableModule,
    MatCardModule,
    MatGridListModule
  ],
  providers: [ArtistService, AlbumService, TrackService]
})
export class ResultsModule { }
