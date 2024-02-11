import { Component, EventEmitter, Output, ElementRef, ViewChild } from '@angular/core';
import { Trip } from '../ITrip';
import { TripService } from '../tripService/trip.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent{
  constructor(public tripService: TripService, private router: Router){}

  trip: Trip = {"name": "nazwa", "country": "kraj", "start": "rrrr-mm-dd", "end": "rrrr-mm-dd", "price": 0, "places": 0, "desc": "opis", "img": "", "sumOfRates": 0, "numberOfRates": 0};
  @Output() notify = new EventEmitter<Trip>();
  @ViewChild('end') endInput : ElementRef;
  @ViewChild('price') priceInput : ElementRef;
  @ViewChild('places') placesInput : ElementRef;
  priceError: boolean = false;
  placesError: boolean = false;

  changedStart(){
    this.endInput.nativeElement.min = this.trip.start;
    this.trip.end = this.trip.start;
  }

  onSubmit(){
    this.priceError = !this.priceInput.nativeElement.checkValidity();
    this.placesError = !this.placesInput.nativeElement.checkValidity()
    if(!this.priceError && !this.placesError){
      if(this.router.url == '/add'){
        this.tripService.addCard(this.trip);
      }
      else{
        this.tripService.editCard(this.trip);
      }
      this.router.navigate(['/trip-list']);
    }
    
  }

  ngOnInit(){
    if(this.tripService.getTripToEdit() != null){
      this.trip = this.tripService.getTripToEdit();
    }
  }
}
