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
  reservations = [];

  users = [];
	

	API = 'http://localhost:3000';
	
constructor(private http: HttpClient, private route: ActivatedRoute){}  

ngOnInit() {
  this.route.queryParams.subscribe(params => {
    let all_params = JSON.parse(JSON.stringify(params));
    all_params.fields = "image type damaged_status name location description notes _id";
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
  

  this.route.queryParams.subscribe(params => {
    let all_params = JSON.parse(JSON.stringify(params));
    this.http.get(`${this.API}/reservations/1`, {params: params})
      .subscribe((reservationsResp: any) => {
        this.reservations = reservationsResp.reservations;
        this.reservations.forEach(reserv => {
          var temp_start_date = new Date(reserv.start_date);
          var temp_end_date = new Date(reserv.end_date);
          reserv.start_date=temp_start_date.toISOString().split('T')[0] + ' ' + temp_start_date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true, minute: 'numeric' });
          reserv.end_date=temp_end_date.toISOString().split('T')[0] + ' ' + temp_end_date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true, minute: 'numeric' });
        });
      })
  });
}

};