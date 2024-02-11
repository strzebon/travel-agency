import { Component } from '@angular/core';
import { TripService } from './tripService/trip.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(public tripService: TripService){}

  title = 'Wycieczki';
  form: boolean = false;
  showBasket: boolean = false;
  totalPrice: number = 0;


  summary(){
    this.showBasket = !this.showBasket;
  }

  hideSummary(){
    this.showBasket = false;
  }
}
