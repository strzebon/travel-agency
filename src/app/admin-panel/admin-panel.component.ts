import { Component } from '@angular/core';
import { TripService } from '../tripService/trip.service';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent {
  constructor(public tripService: TripService){}
  selectedOption: string;
}
