import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Router} from '@angular/router';
import { map } from 'rxjs/operators';
import * as moment from "moment";
declare var $: any;

interface ItemPostResponse
{
    "message": String,
    "created_item": {
        "name": String,
        "location": String,
        "_id": String,
        "request": {
            "type": String,
            "url": String
        }
    }
}


@Component({
  selector: 'app-create-item-form',
  templateUrl: './create-item-form.component.html',
  styleUrls: ['./create-item-form.component.css']
})
export class CreateItemFormComponent implements OnInit {

    // Link to our api, pointing to localhost
  API = 'http://localhost:3000';

  // Declare empty list of people
  items: any[] = [];
  
  constructor(private http: HttpClient, private router: Router) {}

  // Angular 2 Life Cycle event when component has been initialized
  ngOnInit() {
  }

  // Add one item to the API
  addItem(name, type, location, description, damaged_status, notes, image) {
  	if (this.isLoggedIn()){
	    let formData: FormData = new FormData();
	    formData.append('name', name);
      formData.append('type', type);
	    formData.append('location', location);
	    formData.append('description', description);
	    formData.append('damaged_status', damaged_status);
	    formData.append('notes', notes);
	    formData.append('image', image[0]);

	    this.http.post<ItemPostResponse>(`${this.API}/items`, formData)
			.subscribe(resp => {
				console.log('item created', resp.created_item._id);
				this.router.navigate(['/items']).then(() => {
            window.location.reload();
        });
			})
	}
  }

  public isLoggedIn() {
    return moment().isBefore(this.getExpiration());
  }

  getExpiration() {
    const expiration = localStorage.getItem("expiration");
    const expiresAt = JSON.parse(expiration);
    return moment(expiresAt);
  }

  showModal():void {
    $("#myModal").modal('show');
  }
  sendModal(): void {
    //do something here
    this.hideModal();
  }
  hideModal():void {
    document.getElementById('close-modal').click();
  }

}
