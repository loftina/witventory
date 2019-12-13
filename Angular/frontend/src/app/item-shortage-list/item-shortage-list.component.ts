import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit,ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CreateReservationFormComponent } from '../create-reservation-form/create-reservation-form.component';
import { CreateItemFormComponent } from '../create-item-form/create-item-form.component';
import { ApiSettings } from '../ApiSettings';
import * as $ from 'jquery';

@Component({
  selector: 'app-item-shortage-list',
  templateUrl: './item-shortage-list.component.html',
  styleUrls: ['./item-shortage-list.component.css']
})
export class ItemShortageListComponent implements OnInit {

	items = [];
	pagination = [];
	page = 1;

  	API = ApiSettings.API_ENDPOINT;

	constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router, private modalService: NgbModal) { }

	ngOnInit() {
		this.route.queryParams.subscribe(params => {
			this.http.get(`${this.API}/item_shortages/1`)
				.subscribe((itemsResp: any) => {
					this.pagination = Array(itemsResp.total_pages).fill(0).map((x,i)=>i+1)
					this.items = itemsResp.item_shortages;
					this.page = itemsResp.current_page;
				})
		});

		
	}

	newPage(new_page) {
		if (this.pagination[0] > new_page) {
			new_page = this.pagination[this.pagination.length-1]
		}
		else if (this.pagination[this.pagination.length-1] < new_page) {
			new_page = this.pagination[0];
		}
		this.route.queryParams.subscribe(params => {
			this.http.get(`${this.API}/item_shortages/` + String(new_page))
				.subscribe((itemsResp: any) => {
					this.pagination = Array(itemsResp.total_pages).fill(0).map((x,i)=>i+1)
					this.items = itemsResp.item_shortages;
					this.page = itemsResp.current_page;
				})
		});
	}

	openReservationModal(itemId) {
		console.log('trying to open reservation modal');
	    const modalRef = this.modalService.open(CreateReservationFormComponent, { centered: true, windowClass: 'custom-class' });
	    modalRef.componentInstance.itemId = itemId;
	}
	
	isAdmin() {
		return localStorage.getItem("admin") === "true";
	}

	mark(item_id) {
		this.http.patch(`${this.API}/items/item/` + item_id, [{"propName": "damaged_status", "value": "false"}])
			.subscribe(res => {
				this.router.navigateByUrl('/RefreshComponent', { skipLocationChange: true }).then(() => {
					this.router.navigate(['/items/damaged']);
				});
			});
	}

	markResolved(item_id) {
		this.http.delete(`${this.API}/item_shortages/item_shortage/` + item_id)
			.subscribe(() => {
				this.router.navigateByUrl('/RefreshComponent', { skipLocationChange: true }).then(() => {
					this.router.navigate(['/shortages']);
				});
			});
	}

}
