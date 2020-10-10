import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ArtistInfoComponent } from './artist-info/artist-info.component';
import { AlbumInfoComponent } from './album-info/album-info.component';

const routes: Routes = [
  {path: 'artist/:name/:id', component: ArtistInfoComponent},
  {path: 'album/:name/:id', component: AlbumInfoComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResultsRoutingModule { }
