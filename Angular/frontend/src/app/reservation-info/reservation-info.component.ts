import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiSettings } from '../ApiSettings';


import * as moment from "moment";

@Component({
  selector: 'app-reservation-info',
  templateUrl: './reservation-info.component.html',
  styleUrls: ['./reservation-info.component.css']
})
export class ReservationInfoComponent implements OnInit {

	end_times = [];

	start_times = [];

	reservation: {};
	existing_reservations = {};
	available_dates = [];

	API = ApiSettings.API_ENDPOINT;

	constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router) { }

	ngOnInit() {
		this.route.paramMap.subscribe(params => {
		 		this.http.get(`${this.API}/reservations/reservation/` + params.get('id'))
					.subscribe((reservationResp: any) => {
						console.log(reservationResp.reservation)
						this.reservation = reservationResp.reservation;
					});
	    });
	}

	deleteReservation(id) {
		this.http.delete(`${this.API}/reservations/reservation/` + id)
			.subscribe(() => {
				console.log('reservation deleted');
				this.router.navigate(['/reservations'], {queryParams: {user: localStorage.getItem("id")}});
			});
	}

	isAdmin() {
		return localStorage.getItem("admin") === "true";
	}

}
