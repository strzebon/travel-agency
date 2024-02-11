import { Component } from '@angular/core';
import { TripService } from '../tripService/trip.service';


@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.css']
})

export class BasketComponent {
  constructor(public tripService: TripService){}
}
