import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ApiSettings } from '../ApiSettings';
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

	API = ApiSettings.API_ENDPOINT;

	end_times = [];

	start_times = [];

	reservation: {};
	existing_reservations = {};
	available_dates = [];

  	constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute, public activeModal: NgbActiveModal) { }

  	ngOnInit() {
  	}

 	// Reserve Item
	createReservation(available_date, start_time, end_time) {
		var start = (available_date.start.getYear() + 1900) + '-' + this.pad(available_date.start.getMonth() + 1, 2) + '-' + this.pad(available_date.start.getDate(), 2) + 'T' + this.pad(start_time.hour, 2) + ':' + this.pad(start_time.minute, 2)+':00.000-' + this.pad((new Date()).getTimezoneOffset()/60, 2) + ':00'
		var end = (available_date.start.getYear() + 1900) + '-' + this.pad(available_date.start.getMonth() + 1, 2) + '-' + this.pad(available_date.start.getDate(), 2) + 'T' + this.pad(end_time.hour, 2) + ':' + this.pad(end_time.minute, 2)+':00.000-' + this.pad((new Date()).getTimezoneOffset()/60, 2) + ':00'

		if (this.isLoggedIn()) {
		    this.http.post<ReservationPostResponse>(`${this.API}/reservations`, {"item": this.itemId, "start_date": start, "end_date": end})
				.subscribe(res => {
					this.router.navigate(['/reservation/', res.createdReservation._id]);
				});
			this.activeModal.close('Reservation Submitted');
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

	pad(n, width) {
		n = n + '';
		return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
	}

	getAvailableRanges(date, starting_dates, ending_dates) {
		var available_dates = []

		// console.log(date);

		if (starting_dates.length == 0) {
			return [{ 'start': new Date(`${date.getYear() + 1900}-${this.pad(date.getMonth()+1, 2)}-${this.pad(date.getDate(), 2)}T00:00:00.000-${this.pad((new Date()).getTimezoneOffset()/60, 2)}:00`), 'end': new Date(`${date.getYear() + 1900}-${this.pad(date.getMonth()+1, 2)}-${this.pad(date.getDate(), 2)}T23:59:59.000-${this.pad((new Date()).getTimezoneOffset()/60, 2)}:00`), 'isCollapsed': false }]
		}

		var first_start = starting_dates.shift()
		var last_end = ending_dates.pop()

		if (first_start > new Date(`${first_start.getYear() + 1900}-${this.pad(first_start.getMonth()+1, 2)}-${this.pad(first_start.getDate(), 2)}T00:00:00.000-${this.pad((new Date()).getTimezoneOffset()/60, 2)}:00`)) {
			available_dates.push({ 'start': new Date(`${first_start.getYear() + 1900}-${this.pad(first_start.getMonth()+1, 2)}-${this.pad(first_start.getDate(), 2)}T00:00:00.000-${this.pad((new Date()).getTimezoneOffset()/60, 2)}:00`), 'end': first_start, 'isCollapsed': false })
		}

		for (var i = 0; i < starting_dates.length; i++) {
			if (ending_dates[i].getTime() != starting_dates[i].getTime()){
				available_dates.push({ 'start': ending_dates[i], 'end': starting_dates[i], 'isCollapsed': false })
			}
		}

		if (last_end < new Date(`${first_start.getYear() + 1900}-${this.pad(first_start.getMonth()+1, 2)}-${this.pad(first_start.getDate(), 2)}T23:59:59.000-${this.pad((new Date()).getTimezoneOffset()/60, 2)}:00`)) {
			available_dates.push({ 'start': last_end, 'end': new Date(`${first_start.getYear() + 1900}-${this.pad(first_start.getMonth()+1, 2)}-${this.pad(first_start.getDate(), 2)}T23:59:59.000-${this.pad((new Date()).getTimezoneOffset()/60, 2)}:00`), 'isCollapsed': false })
		}

		// console.log(available_dates)
		return available_dates
	}

	onDateSelect(date) {
		var padded_day = this.pad(date.day, 2)
		var padded_month = this.pad(date.month, 2)

		var start_dates = []
		var end_dates = []
		console.log(date.year);
		console.log(this.pad(date.month, 2));
		console.log(this.pad(date.day, 2));
		this.http.get(`${this.API}/reservations/1`, {params: {start: `${date.year}-${padded_month}-${padded_day}T00:00:00.000-${this.pad((new Date()).getTimezoneOffset()/60, 2)}:00`, end: `${date.year}-${padded_month}-${padded_day}T23:59:59.000-${this.pad((new Date()).getTimezoneOffset()/60, 2)}:00`}})
			.subscribe((reservationResp: any) => {
				reservationResp.reservations.map(reserv => {
					console.log(reserv);
					console.log(new Date(reserv.start_date));
					console.log(new Date(reserv.end_date));
					start_dates.push(new Date(reserv.start_date));
					end_dates.push(new Date(reserv.end_date));
				})
				// if (true) {
				this.available_dates = this.getAvailableRanges(new Date(`${date.year}-${padded_month}-${padded_day}T00:00:00.000-${this.pad((new Date()).getTimezoneOffset()/60, 2)}:00`), start_dates.sort(), end_dates.sort())
				console.log(this.available_dates);
				this.start_times = this.available_dates.map(date_pair => { return {hour: date_pair.start.getHours(), minute: date_pair.start.getMinutes()} })
				this.end_times = this.available_dates.map(date_pair => { return {hour: date_pair.end.getHours(), minute: date_pair.end.getMinutes()} })
				this.existing_reservations = reservationResp.reservations;
				// }
				// else {
				// 	this.available_dates = this.getAvailableRanges(new Date(`${date.year}-${padded_month}-${padded_day}T00:00:00.000-05:00`)
				// }
			});
	}
}
