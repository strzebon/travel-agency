import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { TripService } from '../tripService/trip.service';

@Injectable({
  providedIn: 'root'
})
export class ManagerGuard implements CanActivate {
  constructor( public tripService: TripService, public router: Router ){}

  canActivate( next: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<boolean> | Promise<boolean> | boolean {
      if(!this.tripService.isManager()) {
        this.router.navigate(['trip-list']);
      }
      return true;
    } 
}
