import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
  selector: 'app-item-info',
  templateUrl: './item-info.component.html',
  styleUrls: ['./item-info.component.css']
})
export class ItemInfoComponent implements OnInit {

	item: {};
	reservations = [];

	API = 'http://localhost:3000';

	constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router) { }

	ngOnInit() {
		this.route.paramMap.subscribe(params => {
		 		this.http.get(`${this.API}/items/item/` + params.get('id'))
					.subscribe((itemResp: any) => {
						console.log(itemResp.item)
						this.item = itemResp.item
					})
				// should move reservations to another component
				// will not show reservations past first page
				this.http.get(`${this.API}/reservations/1`, {params: {item: params.get('id')}})
					.subscribe((reservationsResp: any) => {
						console.log(reservationsResp.reservations)
						this.reservations = reservationsResp.reservations;
					})
	    });
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