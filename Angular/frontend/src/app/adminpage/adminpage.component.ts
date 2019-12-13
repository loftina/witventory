import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ItemInfoComponent} from '../item-info/item-info.component';
import { ItemListComponent} from '../item-list/item-list.component';
import {ReservationListComponent} from '../reservation-list/reservation-list.component';
import { ApiSettings } from '../ApiSettings';





@Component({
  selector: 'adminpage',
  templateUrl: './adminpage.component.html',
  styleUrls: ['./adminpage.component.css']
})

export class AdminPageComponent implements OnInit {

  users_pagination = [];
  users_page = 1;

  items = [];
	items_pagination = [];
  items_page = 1;

  reservations = [];
  resPagination = [];
  resPage = 1;

  dmgItemsPagination = []
  dmgItems = []
  dmgPage = 1

  shortage_items = [];
	shortage_pagination = [];
	shortage_page = 1;

  damaged_item_reports = [];
 	damaged_item_reports_pagination = [];
	damaged_item_reports_page = 1;

  users = [];
	

	API = ApiSettings.API_ENDPOINT;
	
constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router,){}  

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
    all_params.fields = "image type name location description notes _id";
    all_params.damaged_status = true;
    this.http.get(`${this.API}/items/1`, {params: all_params})
      .subscribe((itemsResp: any) => {
        this.dmgItemsPagination = Array(itemsResp.total_pages).fill(0).map((x,i)=>i+1)
        this.dmgItems = itemsResp.items;
        this.dmgPage = itemsResp.current_page;
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
        this.resPagination = Array(reservationsResp.total_pages).fill(0).map((x,i)=>i+1)
        this.resPage = reservationsResp.current_page;


      })
  });

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

  this.route.queryParams.subscribe(params => {
    this.http.get(`${this.API}/item_shortages/1`)
      .subscribe((itemsResp: any) => {
        this.shortage_pagination = Array(itemsResp.total_pages).fill(0).map((x,i)=>i+1)
        this.shortage_items = itemsResp.item_shortages;
        this.shortage_page = itemsResp.current_page;
      })
  });
  
}

deleteItem(item_id) {
  this.http.delete(`${this.API}/items/item/` + item_id)
    .subscribe(() => {
      this.router.navigateByUrl('/RefreshComponent', { skipLocationChange: true }).then(() => {
        this.router.navigate(['/adminpage']);
      });
    });
}

deleteReservation(id) {
  this.http.delete(`${this.API}/reservations/reservation/` + id)
    .subscribe(() => {
      this.ngOnInit();
    });
}

newDmgPage(new_page) {
  if (this.dmgItemsPagination[0] > new_page) {
    new_page = this.dmgItemsPagination[this.dmgItemsPagination.length-1]
  }
  else if (this.dmgItemsPagination[this.dmgItemsPagination.length-1] < new_page) {
    new_page = this.dmgItemsPagination[0];
  }
  this.route.queryParams.subscribe(params => {
    let all_params = JSON.parse(JSON.stringify(params));
    all_params.fields = "image type name location description notes _id";
    all_params.damaged_status = true;
    this.http.get(`${this.API}/items/` + String(new_page), {params: all_params})
      .subscribe((itemsResp: any) => {
        this.dmgItemsPagination = Array(itemsResp.total_pages).fill(0).map((x,i)=>i+1)
        this.dmgItems = itemsResp.items;
        this.dmgPage = itemsResp.current_page;
      })
  });
}



newDmgReportsPage(new_page) {
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


newItemShortagePage(new_page) {
  if (this.shortage_pagination[0] > new_page) {
    new_page = this.shortage_pagination[this.shortage_pagination.length-1]
  }
  else if (this.shortage_pagination[this.shortage_pagination.length-1] < new_page) {
    new_page = this.shortage_pagination[0];
  }
  this.route.queryParams.subscribe(params => {
    this.http.get(`${this.API}/item_shortages/` + String(new_page))
      .subscribe((itemsResp: any) => {
        this.shortage_pagination = Array(itemsResp.total_pages).fill(0).map((x,i)=>i+1)
        this.shortage_items = itemsResp.item_shortages;
        this.shortage_page = itemsResp.current_page;
      })
  });
}


newUsersPage(new_page) {
  this.http.get(`${this.API}/users/` + String(new_page))
        .subscribe((usersResp: any)=> {
          this.users = usersResp.users;
          this.users.forEach(user => {
              var temp_created_date = new Date(user.created);
              user.created = temp_created_date.toISOString().split('T')[0] + ' ' + temp_created_date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true, minute: 'numeric' });
            });
          this.users_pagination = Array(usersResp.total_pages).fill(0).map((x,i)=>i+1);
          this.users_page = usersResp.current_page;
        })
  }
  
  deleteUser(id) {
    this.http.delete(`${this.API}/users/user/` + id)
      .subscribe(() => {
        this.router.navigateByUrl('/RefreshComponent', { skipLocationChange: true }).then(() => {
          this.router.navigate(['/shortages']);
        });
      });
  }

newResListPage(new_page) {
  if (this.resPagination[0] > new_page) {
    new_page = this.resPagination[this.resPagination.length-1]
  }
  else if (this.resPagination[this.resPagination.length-1] < new_page) {
    new_page = this.resPagination[0];
  }
  this.route.queryParams.subscribe(params => {
    let all_params = JSON.parse(JSON.stringify(params));
    this.http.get(`${this.API}/reservations/` + String(new_page), {params: params})
      .subscribe((reservationsResp: any) => {
        this.resPagination = Array(reservationsResp.total_pages).fill(0).map((x,i)=>i+1)
        this.reservations = reservationsResp.reservations;
        this.reservations.forEach(reserv => {reserv.start_date=(new Date(reserv.start_date)).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true, minute: 'numeric' }); reserv.end_date=(new Date(reserv.end_date)).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true, minute: 'numeric' })});
        this.resPage = reservationsResp.current_page;
      })
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

};