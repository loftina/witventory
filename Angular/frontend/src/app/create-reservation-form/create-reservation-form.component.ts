import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import * as moment from "moment";

interface ReservationPostResponse
{
    "message": String,
    "createdReservation": {
        "_id": String,
        "item": String,
        "start_date": String,
        "end_date": String
    },
    "request": {
        "type": String,
        "url": String
    }
}

@Component({
  selector: 'app-create-reservation-form',
  templateUrl: './create-reservation-form.component.html',
  styleUrls: ['./create-reservation-form.component.css']
})
export class CreateReservationFormComponent implements OnInit {

	@Input() itemId;

	API = 'http://localhost:3000';

  	constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute, public activeModal: NgbActiveModal) { }

  	ngOnInit() {
  		console.log('init reservation modal');
  	}

 	// Reserve Item
	createReservation(start, end) {
		console.log('creating reservation');
		if (this.isLoggedIn()) {
			this.route.paramMap.subscribe(params => {
			    this.http.post<ReservationPostResponse>(`${this.API}/reservations`, {"item": + this.itemId, "start_date": start, "end_date": end})
					.subscribe(res => {
						console.log('reservation created');
						console.log(res);
						this.router.navigate(['/reservation/', res.createdReservation._id]);
					})
			});
		}
	}

	public isLoggedIn() {
		return moment().isBefore(this.getExpiration());
	}

	getExpiration() {
		const expiration = localStorage.getItem("expiration");
		const expiresAt = JSON.parse(expiration);
		return moment(expiresAt);
	}
}
