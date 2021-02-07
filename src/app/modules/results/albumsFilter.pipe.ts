import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'albumsFilter',
    pure: false
})
export class AlbumsFilterPipe implements PipeTransform {
    transform(items: any[], filter: any): any {
        if (!items || !filter) {
            return items;
        }
        return items.filter(item => item.album_group.indexOf(filter.album_group) !== -1);
    }
}
