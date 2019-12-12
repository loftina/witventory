import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiSettings } from '../ApiSettings';

@Component({
  selector: 'app-item-note-list',
  templateUrl: './item-note-list.component.html',
  styleUrls: ['./item-note-list.component.css']
})
export class ItemNoteListComponent implements OnInit {

	@Input()
    item_id: string;

  	item_comments = [];
 	pagination = [];
	page = 1;

	API = ApiSettings.API_ENDPOINT;

	constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute) { }

	ngOnInit() {
		console.log(this.item_id);
		this.route.queryParams.subscribe(params => {
			this.http.get(`${this.API}/item_comments/1`, {params: {item: this.item_id}})
				.subscribe((itemCommentsResp: any) => {
					this.pagination = Array(itemCommentsResp.total_pages).fill(0).map((x,i)=>i+1)
					this.item_comments = itemCommentsResp.item_comments;
					this.page = itemCommentsResp.current_page;

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
			this.http.get(`${this.API}/item_comments/` + String(new_page), {params: params})
				.subscribe((itemCommentsResp: any) => {
					this.pagination = Array(itemCommentsResp.total_pages).fill(0).map((x,i)=>i+1)
					this.item_comments = itemCommentsResp.item_comments;
					this.page = itemCommentsResp.current_page;
				})
		});
	}

	deleteDamagedRequest(id) {
		this.http.delete(`${this.API}/item_comments/item_comments/` + id)
			.subscribe(() => {
				this.ngOnInit();
			});
	}

}
