import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  isLoading: boolean;

  constructor() { }

  startLoading(){
    return this.isLoading = true;
  }

  finishLoading(){
    return this.isLoading = false;
  }
}
