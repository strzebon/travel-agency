import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { map, Observable } from 'rxjs';
import { TripService } from '../tripService/trip.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor( public tripService: TripService, public router: Router ){}

  canActivate( next: ActivatedRouteSnapshot, state: RouterStateSnapshot):
  Observable<boolean> {
    return this.tripService.angularFireAuth.authState.pipe(map(state =>{
    if(state !== null) {
    return true;
    }
    this.router.navigate(['login']) ;
    return false;
    }))
  }  
}
