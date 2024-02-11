import { Component } from '@angular/core';
import { TripService } from '../tripService/trip.service';

@Component({
  selector: 'app-trip-list',
  templateUrl: './trip-list.component.html',
  styleUrls: ['./trip-list.component.css']
})
export class TripListComponent {
  constructor(public tripService: TripService){};
}
