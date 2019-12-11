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
	items_pagination = [];
	items_page = 1;

  users = [];
	

	API = 'http://localhost:3000';
	
constructor(private http: HttpClient, private route: ActivatedRoute){}  

ngOnInit() {
  this.route.queryParams.subscribe(params => {
    let all_params = JSON.parse(JSON.stringify(params));
    all_params.fields = "image type name location description notes _id";
    this.http.get(`${this.API}/items/1`, {params: all_params})
      .subscribe((itemsResp: any) => {
        this.items_pagination = Array(itemsResp.total_pages).fill(0).map((x,i)=>i+1)
        this.items = itemsResp.items;
        this.items_page = itemsResp.current_page;
      })
    this.http.get(`${this.API}/users/1`)
      .subscribe((usersResp: any)=> {
        this.users = usersResp.users;
        this.users.forEach(user => {
            var temp_created_date = new Date(user.created);
            user.created = temp_created_date.toISOString().split('T')[0] + ' ' + temp_created_date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true, minute: 'numeric' });
          });
      })
  });

  
}

};