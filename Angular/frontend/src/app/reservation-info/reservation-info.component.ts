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

	reservation: {start_date: String, end_date: String};
	existing_reservations = {};
	available_dates = [];

	API = ApiSettings.API_ENDPOINT;

	constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router) { }

	ngOnInit() {
		this.route.paramMap.subscribe(params => {
		 		this.http.get(`${this.API}/reservations/reservation/` + params.get('id'))
					.subscribe((reservationResp: any) => {
						var reservation = reservationResp.reservation;
						var temp_start_date = new Date(reservation.start_date);
						var temp_end_date = new Date(reservation.end_date);
						reservation.start_date = temp_start_date.toISOString().split('T')[0] + ' ' + temp_start_date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true, minute: 'numeric' });
						reservation.end_date = temp_end_date.toISOString().split('T')[0] + ' ' + temp_end_date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true, minute: 'numeric' });
						this.reservation = reservation;
					});
	    });
	}

	deleteReservation(id) {
		this.http.delete(`${this.API}/reservations/reservation/` + id)
			.subscribe(() => {
				this.router.navigate(['/reservations'], {queryParams: {user: localStorage.getItem("id")}});
			});
	}

	isAdmin() {
		return localStorage.getItem("admin") === "true";
	}

}
