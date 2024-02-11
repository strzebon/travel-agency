import { Component } from '@angular/core';
import { TripService } from '../tripService/trip.service';


@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent {
  constructor(public tripService: TripService){}
  selectedStatus: number = 0;
  numbers: number[] = [0, 1, 2, 3, 4];
  stars: number = 0;

  before(startDate: string){
    return new Date() < new Date(startDate);
  }

  inProcess(startDate: string, endDate: string){
    return new Date() >= new Date(startDate) && new Date() <= new Date(endDate);
  }

  after(endDate: string){
    return new Date() > new Date(endDate);
  }

  show(status: number, start: string, end: string){
    if(status == 0) return true;
    if(status == 1) return this.before(start);
    if(status == 2) return this.inProcess(start, end);
    if(status == 3) return this.after(end);
    return true;
  }

  giveStars(number: number){
    this.stars = number + 1; 
  }
}
