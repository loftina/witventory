import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'adminpage',
  templateUrl: './adminpage.component.html',
  styleUrls: ['./adminpage.component.css']
})

export class AdminPageComponent implements OnInit {

  items = [];
	pagination = [];
	page = 1;
	

	API = 'http://localhost:3000';
	
constructor(private http: HttpClient, private route: ActivatedRoute){}  

ngOnInit() {
  this.route.queryParams.subscribe(params => {
    let all_params = JSON.parse(JSON.stringify(params));
    all_params.fields = "image type name location description notes _id";
    this.http.get(`${this.API}/items/1`, {params: all_params})
      .subscribe((itemsResp: any) => {
        this.pagination = Array(itemsResp.total_pages).fill(0).map((x,i)=>i+1)
        this.items = itemsResp.items;
        this.page = itemsResp.current_page;
      })
  });

  
}

};