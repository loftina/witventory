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

	API = 'http://localhost:3000';

	constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router) { }

	ngOnInit() {
		this.route.paramMap.subscribe(params => {
		 		this.http.get(`${this.API}/items/` + params.get('id'))
				.subscribe((itemResp: any) => {
					console.log(itemResp.item)
					this.item = itemResp.item
				})
	    }) 
	}

	// Reserve Item
	createReservation(start, end, id) {
		console.log('creating reservation');
		if (this.isLoggedIn()) {
			var headers_object = new HttpHeaders().set("Authorization", "Bearer " + localStorage.getItem("token"));
		  	const httpOptions = {
		    	headers: headers_object
		    };
		    this.http.post<ReservationPostResponse>(`${this.API}/reservations`, {"item": id, "start_date": start, "end_date": end}, httpOptions)
				.subscribe(res => {
					console.log('reservation created');
					console.log(res);
					this.router.navigate(['/reservation/', res.createdReservation._id]);
				})
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