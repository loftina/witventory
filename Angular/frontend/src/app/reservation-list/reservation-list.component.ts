import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-reservation-list',
  templateUrl: './reservation-list.component.html',
  styleUrls: ['./reservation-list.component.css']
})
export class ReservationListComponent implements OnInit {

 	reservations = [];
 	pagination = [];
	page = 1;

	API = 'http://localhost:3000';

	constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute) { }

	ngOnInit() {
		this.route.queryParams.subscribe(params => {
			let all_params = JSON.parse(JSON.stringify(params));
			this.http.get(`${this.API}/reservations/1`, {params: params})
				.subscribe((reservationsResp: any) => {
					this.pagination = Array(reservationsResp.total_pages).fill(0).map((x,i)=>i+1)
					this.reservations = reservationsResp.reservations;
					this.reservations.forEach(reserv => {
						var temp_start_date = new Date(reserv.start_date);
						var temp_end_date = new Date(reserv.end_date);
						reserv.start_date=temp_start_date.toISOString().split('T')[0] + ' ' + temp_start_date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true, minute: 'numeric' });
						reserv.end_date=temp_end_date.toISOString().split('T')[0] + ' ' + temp_end_date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true, minute: 'numeric' });
					});
					this.page = reservationsResp.current_page;

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
			this.http.get(`${this.API}/reservations/` + String(new_page), {params: params})
				.subscribe((reservationsResp: any) => {
					this.pagination = Array(reservationsResp.total_pages).fill(0).map((x,i)=>i+1)
					this.reservations = reservationsResp.reservations;
					this.reservations.forEach(reserv => {reserv.start_date=(new Date(reserv.start_date)).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true, minute: 'numeric' }); reserv.end_date=(new Date(reserv.end_date)).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true, minute: 'numeric' })});
					this.page = reservationsResp.current_page;
				})
		});
	}

	deleteReservation(id) {
		this.http.delete(`${this.API}/reservations/reservation/` + id)
			.subscribe(() => {
				this.ngOnInit();
			});
	}
}
