import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiSettings } from '../ApiSettings';

@Component({
  selector: 'app-item-damage-list',
  templateUrl: './item-damage-list.component.html',
  styleUrls: ['./item-damage-list.component.css']
})
export class ItemDamageListComponent implements OnInit {

 	damaged_item_reports = [];
 	damaged_item_reports_pagination = [];
	damaged_item_reports_page = 1;

	API = ApiSettings.API_ENDPOINT;

	constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute) { }

	ngOnInit() {
		this.route.queryParams.subscribe(params => {
			console.log(params);
			console.log('asd');
			let all_params = JSON.parse(JSON.stringify(params));
			this.http.get(`${this.API}/item_damages/1`, {params: params})
				.subscribe((itemDamagesResp: any) => {
					this.damaged_item_reports_pagination = Array(itemDamagesResp.total_pages).fill(0).map((x,i)=>i+1)
					this.damaged_item_reports = itemDamagesResp.item_damages;
					this.damaged_item_reports_page = itemDamagesResp.current_page;

				})
		});
	}

	newPage(new_page) {
		if (this.damaged_item_reports_pagination[0] > new_page) {
			new_page = this.damaged_item_reports_pagination[this.damaged_item_reports_pagination.length-1]
		}
		else if (this.damaged_item_reports_pagination[this.damaged_item_reports_pagination.length-1] < new_page) {
			new_page = this.damaged_item_reports_pagination[0];
		}
		this.route.queryParams.subscribe(params => {
			let all_params = JSON.parse(JSON.stringify(params));
			this.http.get(`${this.API}/item_damages/` + String(new_page), {params: params})
				.subscribe((itemDamagesResp: any) => {
					this.damaged_item_reports_pagination = Array(itemDamagesResp.total_pages).fill(0).map((x,i)=>i+1)
					this.damaged_item_reports = itemDamagesResp.item_damages;
					this.damaged_item_reports_page = itemDamagesResp.current_page;
				})
		});
	}

	deleteDamagedRequest(id) {
		this.http.delete(`${this.API}/item_damages/item_damage/` + id)
			.subscribe(() => {
				this.ngOnInit();
			});
	}

	deleteAndUpdateDamaged(req_id, item_id) {
		const headers = new HttpHeaders()
			.set("Content-Type", "application/json");
		this.http.patch(`${this.API}/items/item/` + item_id, [{"propName": "damaged_status", "value": "true"}])
			.subscribe(res => {
				this.deleteDamagedRequest(req_id);
			});
	}

}
