import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Router} from '@angular/router';
import * as moment from "moment";

@Component({
  selector: 'app-sign-in-form',
  templateUrl: './sign-in-form.component.html',
  styleUrls: ['./sign-in-form.component.css']
})
export class SignInFormComponent implements OnInit {

	API = 'http://localhost:3000';

	constructor(private http: HttpClient, private router: Router) { }

	ngOnInit() {
	}

	// Login User
	loginUser(email, password) {
		console.log('logging in user')
		this.http.post(`${this.API}/users/login`, {email, password})
			.subscribe(res => {
				this.setSession(res);
				this.router.navigate(['/items']);
			})
	}

	private setSession(authResult) {
		const expiresAt = moment().add(authResult.expiration, 'second');

		localStorage.setItem('admin', authResult.admin);
        localStorage.setItem('token', authResult.token);
        localStorage.setItem('expiration', JSON.stringify(expiresAt.valueOf()));
    } 
}
