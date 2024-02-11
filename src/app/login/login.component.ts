import { Component } from '@angular/core';
import { TripService } from '../tripService/trip.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  constructor(public tripService: TripService){}

  login: string = "";
  password: string = "";
}
