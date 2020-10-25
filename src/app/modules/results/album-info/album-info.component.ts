import { Component, OnInit } from '@angular/core';
import { AlbumService } from '../../../services/album.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { LoadingService } from '../../../services/loading.service';
import { Album } from 'src/app/models/album';
import { map } from 'rxjs/operators';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-album-info',
  templateUrl: './album-info.component.html',
  styleUrls: ['./album-info.component.scss']
})
export class AlbumInfoComponent implements OnInit {

  albumName: string;
  albumId: string;
  albumInfo: Album;

  constructor(private albumService: AlbumService, private route: ActivatedRoute, public loading: LoadingService, private webTitle: Title ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      this.albumName = paramMap.get('name');
      this.albumId = paramMap.get('id');
      this.webTitle.setTitle(`${this.albumName} page`);
      this.getAlbumInfo();
    });
  }

  getAlbumInfo(): void {
    this.loading.startLoading()
    setTimeout(() => this.route.params.pipe(map(params => params['id'])).subscribe((id: string) => {
      this.albumService.getAlbum(id).subscribe(album => {
        this.albumInfo = album;
        console.log(album);
        this.loading.finishLoading();
      })
     }), 2500)
  }
}
