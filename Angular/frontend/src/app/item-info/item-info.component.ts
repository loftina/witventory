import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CreateReservationFormComponent } from '../create-reservation-form/create-reservation-form.component';
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
  selector: 'app-item-info',
  templateUrl: './item-info.component.html',
  styleUrls: ['./item-info.component.css']
})
export class ItemInfoComponent implements OnInit {

	item: {};
	reservations = [];
	similar_items = [];

	API = ApiSettings.API_ENDPOINT;

	constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router, private modalService: NgbModal) { }

	ngOnInit() {
		this.route.paramMap.subscribe(params => {
		 		this.http.get(`${this.API}/items/item/` + params.get('id'))
					.subscribe((itemResp: any) => {
						this.item = itemResp.item

						this.http.get(`${this.API}/items/1`, {params: {fields: '_id type name image location', type: itemResp.item.type}})
							.subscribe((itemsResp: any) => {
								var filtered_items = itemsResp.items.filter(function(same_type) { 
										return same_type._id !== itemResp.item._id;  
									})
								if (filtered_items.length > 4) {
									this.similar_items = filtered_items.slice(0,4);
								}
								else {
									this.similar_items = filtered_items;
								}
							});
					});

				// should move reservations to another component
				// will not show reservations past first page
				this.http.get(`${this.API}/reservations/1`, {params: {item: params.get('id')}})
					.subscribe((reservationsResp: any) => {
						this.reservations = reservationsResp.reservations;
					})
	    });
	}

	public isAdmin() {
		return localStorage.getItem("admin") === "true";
	}

	getExpiration() {
		const expiration = localStorage.getItem("expiration");
		const expiresAt = JSON.parse(expiration);
		return moment(expiresAt);
	}

	openReservationModal(itemId) {
		console.log('trying to open reservation modal');
	    const modalRef = this.modalService.open(CreateReservationFormComponent, { centered: true, windowClass: 'custom-class' });
	    modalRef.componentInstance.itemId = itemId;
	}

	deleteItem(itemId) {
		this.http.delete(`${this.API}/items/item/` + itemId)
			.subscribe(() => {
				console.log('item deleted');
				this.router.navigate(['/items']);
			});
	}
}