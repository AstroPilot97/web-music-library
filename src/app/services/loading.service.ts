import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  isLoading = false;

  constructor() { }

  startLoading(){
    return this.isLoading = true;
  }

  finishLoading(){
    return this.isLoading = false;
  }
}
