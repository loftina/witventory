import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
//import { axios } from 'axios';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app works!';

  // Link to our api, pointing to localhost
  API = 'http://localhost:3000';

  // Declare empty list of people
  items: any[] = [];

  constructor(private http: HttpClient) {}

  // Angular 2 Life Cycle event when component has been initialized
  ngOnInit() {
    this.getAllItems();
  }

  // Add User
  createUser(email, password) {
    console.log('creating user')
    this.http.post(`${this.API}/users/signup`, {email, password})
      .subscribe(res => {
        console.log(res)
      })
  }

  // Login User
  loginUser(email, password) {
    console.log('creating user')
    this.http.post(`${this.API}/users/login`, {email, password})
      .subscribe(res => {
        console.log(res)
      })
  }

  // Add one item to the API
  addItem(name, location, description, damaged_status, notes, image) {
    this.http.post(`${this.API}/items`, {name, location, description, damaged_status, notes, image})
      .subscribe(() => {
        this.getAllItems();
      })
  }

  uploadImage (files) {
    console.log(files)
    console.log(files[0])
    const formData = new FormData()
    formData.append('images', files)
    console.log(formData)
    this.http.post(`${this.API}/images`, formData)
  }

  // Get all items from the API
  getAllItems() {
    this.http.get(`${this.API}/items`)
      .subscribe((items: any) => {
        console.log(items)
        this.items = items
      })
  }
}