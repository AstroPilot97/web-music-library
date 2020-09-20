import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ResultsRoutingModule } from './results-routing.module';
import { ArtistInfoComponent } from './artist-info/artist-info.component';


@NgModule({
  declarations: [ArtistInfoComponent],
  imports: [
    CommonModule,
    ResultsRoutingModule
  ]
})
export class ResultsModule { }
