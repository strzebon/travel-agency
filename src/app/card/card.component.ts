import { Component, Input } from '@angular/core';
import { Trip } from '../ITrip';
import { TripService } from '../tripService/trip.service';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent {
  constructor(public tripService: TripService){}

  @Input() trip: Trip;
  @Input() color: string;
  @Input() index: number;

  getColor(num: number) {
    if(num > 3) return "black";
    else if(num > 0) return "orange";
    else return "red"
  }

  numbers(){
    if (this.trip.numberOfRates == 0) return []; 
    const length = Math.round(this.trip.sumOfRates / this.trip.numberOfRates);
    return Array(length).fill(0);
  }
}
