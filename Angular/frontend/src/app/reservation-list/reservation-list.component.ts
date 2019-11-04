import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-reservation-list',
  templateUrl: './reservation-list.component.html',
  styleUrls: ['./reservation-list.component.css']
})
export class ReservationListComponent implements OnInit {

 	reservations = [];

	API = 'http://localhost:3000';

	constructor(private http: HttpClient, private route: ActivatedRoute) { }

	ngOnInit() {
		this.route.queryParams.subscribe(params => {
			this.http.get(`${this.API}/reservations`, {params: params})
				.subscribe((reservationsResp: any) => {
					console.log(reservationsResp.reservations)
					this.reservations = reservationsResp.reservations;
				})
		});
	}

}
