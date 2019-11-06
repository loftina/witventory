import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-reservation-info',
  templateUrl: './reservation-info.component.html',
  styleUrls: ['./reservation-info.component.css']
})
export class ReservationInfoComponent implements OnInit {

	reservation: {};

	API = 'http://localhost:3000';

	constructor(private http: HttpClient, private route: ActivatedRoute) { }

	ngOnInit() {
		this.route.paramMap.subscribe(params => {
		 		this.http.get(`${this.API}/reservations/reservation/` + params.get('id'))
					.subscribe((reservationResp: any) => {
						console.log(reservationResp.reservation)
						this.reservation = reservationResp.reservation;
					});
	    });
	}
}
