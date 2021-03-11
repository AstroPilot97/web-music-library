import { NgModule } from '@angular/core';
//import modułów i komponentów
import { Routes, RouterModule } from '@angular/router';
import { ArtistInfoComponent } from './artist-info/artist-info.component';
import { AlbumInfoComponent } from './album-info/album-info.component';
import { TrackInfoComponent } from './track-info/track-info.component';
import { SearchResultsComponent } from './search-results/search-results.component';

//ścieżki do komponentów wraz z przekazywanymi parametrami
const routes: Routes = [
  {path: 'artist/:id', component: ArtistInfoComponent},
  {path: 'album/:id', component: AlbumInfoComponent},
  {path: 'track/:id', component: TrackInfoComponent},
  {path: 'search-results', component: SearchResultsComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResultsRoutingModule { }
