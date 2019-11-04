import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css']
})
export class ItemListComponent implements OnInit {

	items = [];

	API = 'http://localhost:3000';

	constructor(private http: HttpClient, private route: ActivatedRoute) { }

	ngOnInit() {
		this.route.queryParams.subscribe(params => {
			console.log(params);
			console.log(String(params));
			this.http.get(`${this.API}/items`, {params: params})
				.subscribe((itemsResp: any) => {
					console.log(itemsResp.items)
					this.items = itemsResp.items
				})
		});
	}

}
