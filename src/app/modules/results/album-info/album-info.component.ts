import { Component, OnInit } from '@angular/core';
import { AlbumService } from '../../../services/album.service';
import { ActivatedRoute } from '@angular/router';
import { LoadingService } from '../../../services/loading.service';
import { Album } from 'src/app/models/album';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-album-info',
  templateUrl: './album-info.component.html',
  styleUrls: ['./album-info.component.scss']
})
export class AlbumInfoComponent implements OnInit {

  albumInfo: Album;

  constructor(private albumService: AlbumService, private route: ActivatedRoute, public loading: LoadingService ) {
    this.getAlbumInfo();
   }

  ngOnInit(): void {
  }

  getAlbumInfo(): void {
    setTimeout(() => this.route.params.pipe(map(params => params['id'])).subscribe((id: string) => {
      this.albumService.getAlbum(id).subscribe(album => {
        this.albumInfo = album;
        console.log(album);
        this.loading.finishLoading();
      })
     }), 2500)
  }
}
