import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from "moment";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app works!';

  constructor(private router: Router) {}

  ngOnInit() {}

  public isAdmin() {
    return localStorage.getItem("admin") === "true";
  }

  public isLoggedIn() {
    return moment().isBefore(this.getExpiration());
  }

  public isLoggedOut() {
    return !this.isLoggedIn();
  }

  public logout() {
    localStorage.removeItem("id");
    localStorage.removeItem("admin");
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
    this.router.navigate(['/signin']);
  }

  getExpiration() {
    const expiration = localStorage.getItem("expiration");
    const expiresAt = JSON.parse(expiration);
    return moment(expiresAt);
  }

  searchItems(term) {
    this.router.navigate(['/items'], { queryParams: {name: term}});
  }

  userReservations() {
    this.router.navigate(['/reservations'], { queryParams: {user: localStorage.getItem("id")}});
  }
}