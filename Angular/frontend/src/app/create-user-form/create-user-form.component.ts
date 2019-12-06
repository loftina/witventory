import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Router} from '@angular/router';
import { ApiSettings } from '../ApiSettings';

@Component({
  selector: 'app-create-user-form',
  templateUrl: './create-user-form.component.html',
  styleUrls: ['./create-user-form.component.css']
})
export class CreateUserFormComponent implements OnInit {

  API = ApiSettings.API_ENDPOINT;

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit() {
  }

  // Add User
  createUser(email, password) {
    console.log('creating user')
    this.http.post(`${this.API}/users/signup`, {email, password})
      .subscribe(res => {
        console.log(res)
        this.router.navigate(['/']);
      })
  }

}
