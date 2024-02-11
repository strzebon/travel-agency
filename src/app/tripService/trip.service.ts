import { Injectable } from '@angular/core';
// import Data from '../../assets/trips.json';
import { Trip } from '../ITrip';
import { AngularFireDatabase} from '@angular/fire/compat/database';
import { Observable, of } from 'rxjs';
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class TripService {
  trips: Trip[] = [];
  colors: string[] = [];
  reservations: number[] = [];
  maxPrice: number = 0;
  minPrice: number = 10**10;
  sumOfReserved: number = 0;
  totalPrice: number = 0;
  purchases: any[] = [];
  tripsData: Observable<any[]>;
  userCredentials: Observable<any>;
  user: any;
  reservationsData: Observable<any[]>;
  purchasesData: Observable<any[]>;
  rolesData: Observable<any>
  userData: Observable<any>;
  sumOfReservedData: Observable<any>;
  totalPriceData: Observable<any>;
  login: string;
  uidsData: Observable<any[]>;
  users: any[];
  persistenceData: Observable<any>;
  persistence: string = 'local';
  reservationsSubscription: any;
  purchasesSubscription: any;
  rolesSubscription: any;
  roles: any = {
    manager: false,
    admin: false
  }
  tripToEdit: any = null;

  constructor(public db: AngularFireDatabase, public angularFireAuth: AngularFireAuth, private router: Router) {
    this.tripsData = db.list('/trips').valueChanges();
    this.tripsData.subscribe(x=>{
        this.trips = x;
        this.assignBorder();
    })

    this.uidsData = db.list('/usersInfo').valueChanges();
    this.uidsData.subscribe(x=>{
      this.users = x;
    })

    this.persistenceData = db.object('/persistence').valueChanges();
    this.persistenceData.subscribe(x=>{
      this.persistence = x;
    })
    this.userCredentials = angularFireAuth.authState;
    this.userCredentials.subscribe(x=>{
      this.reservationsSubscription?.unsubscribe();
      this.purchasesSubscription?.unsubscribe();
      this.rolesSubscription?.unsubscribe();

      this.user = x;
      console.log(this.user);

      if(this.isLoggedIn()){
        this.rolesData = db.object('/usersInfo/' + this.user.uid + '/roles').valueChanges();
        this.rolesSubscription = this.rolesData.subscribe(x=>{
          this.roles = x;
          console.log(this.roles);
        })

        this.reservationsData = db.list('/users/' + this.user.uid + '/reservations').valueChanges();
        this.reservationsSubscription = this.reservationsData.subscribe(x=>{
          this.reservations = x;
          this.sumOfReserved = 0;
          this.totalPrice = 0;
          for(let i in this.reservations){
            this.sumOfReserved += this.reservations[i];
            this.totalPrice += this.reservations[i] * this.trips[i].price;
          }
        })
        
        this.purchasesData = db.list('/users/' + this.user.uid + '/purchases').valueChanges();
        this.purchasesSubscription = this.purchasesData.subscribe(x=>{
          this.purchases = x;
        })
      }
      else{
        this.roles = {
          manager: false,
          admin: false
        }
      }
    })
  }

  getTrips(){
    return this.trips;
  }

  getColor(i: number){
    return this.colors[i];
  }

  getReservations(i: number){
    if(i == -1) return 0;
    return this.reservations[i];
  }

  getSumOfReserved(){
    return this.sumOfReserved;
  }

  getTotalPrice(){
    return this.totalPrice;
  }

  getPurchases(){
    return this.purchases;
  }

  getTripToEdit(){
    return this.tripToEdit;
  }

  assignBorder(){
    this.colors = new Array(this.trips.length).fill("lightyellow");
    this.maxPrice = 0;
    this.minPrice = 10**10;

    for(let i=0; i<this.trips.length; i++){
      let price = this.trips[i].price;
      if(price > this.maxPrice){
        this.maxPrice = price;
      }
      if(price < this.minPrice){
        this.minPrice = price;
      }
    }

    for(let i=0; i<this.trips.length; i++){
      let price = this.trips[i].price;
      if(price == this.maxPrice){
        this.colors[i] = "green";
      }
      else if(price == this.minPrice){
        this.colors[i] = "red";
      }
    }
  }

  removeCard(i: number){
    if(i == -1) return;
    this.sumOfReserved -= this.reservations[i];
    this.totalPrice -= this.reservations[i] * this.trips[i].price;
    this.reservations.splice(i, 1);
    const tripsCopy = [...this.trips];
    tripsCopy.splice(i, 1);
    this.db.object('/').update({'trips': tripsCopy});
    for(let user of this.users){
      this.db.list('/users/' + user.uid + '/reservations').query.once("value").then(x=>{
        var tab = x.val();
        tab.splice(i, 1);
        this.db.object('/users/' + user.uid).update({reservations: tab});
      })
    }
  }

  changeReservations(change: number, i: number){
    if(i == -1) return;
    this.db.object('/users/' + this.user.uid + '/reservations').update({[i]: this.reservations[i] + change});
    this.db.list('/trips').update(i.toString(), {places: this.trips[i].places - change});
  }

  addCard(trip: Trip){
    const tripsCopy = [...this.trips];
    tripsCopy.push(trip);
    this.db.object('/').update({'trips': tripsCopy});
    for(let user of this.users){
      this.db.object('/users/' + user.uid + '/reservations').update({[this.reservations.length]: 0});
    }
  }

  editCard(newTrip: Trip){
    for(let i=0; i<this.trips.length; i++){
      if(this.trips[i].name == newTrip.name){
        this.db.list('/trips').update(i.toString(), newTrip);
        break;
      }
    }
  }

  setTripToEdit(trip: any){
    this.tripToEdit = trip;
  }

  purchaseTrip(i: number){
    var purchase = {...this.trips[i], "date": Date(), "rated": false}; 
    purchase.places = this.reservations[i];
    this.purchases.push(purchase);
    this.db.object('/users/' + this.user.uid + '/reservations').update({[i]: 0});
    this.db.object('/users/' + this.user.uid + '/purchases').update({[this.purchases.length]: purchase});
  }

  purchaseAllTrips(){
    for(let i=0; i<this.trips.length; i++){
      if(this.reservations[i] > 0) this.purchaseTrip(i);
    }
  }

  showNotification(purchase: Trip){
    const start = new Date(purchase.start);
    const date = new Date();
    date.setDate(date.getDate() + 30);
    return start > new Date() && start < date;
  }

  giveStars(name: string, stars: number){
    var index = null
    for(let i=0; i<this.trips.length; i++){
      if(this.trips[i].name == name){
        index = i;
        break;
      }
    }
    if(index == null) return;
    this.db.object('/trips/' + index).update({sumOfRates: this.trips[index].sumOfRates + stars})
    this.db.object('/trips/' + index).update({numberOfRates: this.trips[index].numberOfRates + 1})
    var index2 = null
    for(let i=0; i<this.purchases.length; i++){
      if(this.purchases[i].name == name){
        index2 = i + 1;
        break;
      }
    }
    this.db.object('/users/' + this.user.uid + '/purchases/' + index2).update({rated: true})
  }


// auth

  signIn(login: string, password: string){
    return this.angularFireAuth.setPersistence(this.persistence).then(() => {
      return this.angularFireAuth.signInWithEmailAndPassword(login + '@test.com', password)
      .then(() => {
        this.router.navigate(['trip-list']);
      })
      .catch((err) => {
        window.alert(err.message);
      });
  })
  }

  signUp(login: string, password: string){
    return this.angularFireAuth.setPersistence(this.persistence).then(() => {
      return this.angularFireAuth.createUserWithEmailAndPassword(login + '@test.com', password)
      .then((res) => {
        const tab = new Array(this.trips.length).fill(0);
        const roles = {
          manager: false,
          admin: false
        }
        this.db.object('/usersInfo/' + res.user?.uid).set({'uid': res.user?.uid, 'login': login,'roles': roles});
        this.db.object('/users/'+ res.user?.uid).set({
          'reservations': tab,
          // 'sumOfReserved': 0,
          // 'totalPrice': 0
        });
        this.router.navigate(['trip-list']);
      })
      .catch((err) => {
        window.alert(err.message);
      });
    })
  }

  signOut(){
    return this.angularFireAuth.signOut().then(() => {
      this.router.navigate(['login']);
    })
  }

  isLoggedIn(){
    return this.user != null;
  }

  getLogin(){
    var end = this.user.email.indexOf("@");
    return this.user.email.slice(0, end);
  }

  isManager(){
    return this.roles.manager;
  }

  isAdmin(){
    return this.roles.admin;
  }

  changePersistence(newPersistence: string) {
    console.log(newPersistence);
    this.db.object('/').update({'persistence': newPersistence});
  }

  getPersistence(){
    return this.persistence;
  }

  getUsers(){
    return this.users;
  }

  changeRole(uid: string, role: string, value: boolean){
    this.db.object('/usersInfo/' + uid + '/roles').update({[role]: value});
    if(role == 'admin' && value){
      this.db.object('/usersInfo/' + uid + '/roles').update({manager: true});
    }
  }
}
