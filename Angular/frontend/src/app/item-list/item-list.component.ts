import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CreateReservationFormComponent } from '../create-reservation-form/create-reservation-form.component';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css']
})
export class ItemListComponent implements OnInit {

	items = [];
	pagination = [];
	page = 1;

	API = 'http://localhost:3000';

	constructor(private http: HttpClient, private route: ActivatedRoute, private modalService: NgbModal) { }

	ngOnInit() {
		this.route.queryParams.subscribe(params => {
			let all_params = JSON.parse(JSON.stringify(params));
			all_params.fields = "image name location description notes _id";
			this.http.get(`${this.API}/items/1`, {params: all_params})
				.subscribe((itemsResp: any) => {
					this.pagination = Array(itemsResp.total_pages).fill(0).map((x,i)=>i+1)
					this.items = itemsResp.items;
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
			let all_params = JSON.parse(JSON.stringify(params));
			all_params.fields = "image name location description notes _id";
			this.http.get(`${this.API}/items/` + String(new_page), {params: all_params})
				.subscribe((itemsResp: any) => {
					this.pagination = Array(itemsResp.total_pages).fill(0).map((x,i)=>i+1)
					this.items = itemsResp.items;
					this.page = itemsResp.current_page;
				})
		});
	}

	openReservationModal(itemId) {
		console.log('trying to open reservation modal');
	    const modalRef = this.modalService.open(CreateReservationFormComponent, { centered: true });
	    modalRef.componentInstance.itemId = itemId;
	}
}
