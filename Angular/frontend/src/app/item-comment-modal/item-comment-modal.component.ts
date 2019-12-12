import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiSettings } from '../ApiSettings';

import * as moment from "moment";

@Component({
  selector: 'app-item-comment-modal',
  templateUrl: './item-comment-modal.component.html',
  styleUrls: ['./item-comment-modal.component.css']
})
export class ItemCommentModalComponent implements OnInit {

	@Input()
    item_id: string;

    API = ApiSettings.API_ENDPOINT;

	constructor(private http: HttpClient, private router: Router, public activeModal: NgbActiveModal) { }

	ngOnInit() {
	}

	postComment(comment) {
		if (this.isLoggedIn()) {
		    this.http.post(`${this.API}/item_comments/`, {"item": this.item_id, "comment": comment})
				.subscribe(res => {
					this.router.navigateByUrl('/RefreshComponent', { skipLocationChange: true }).then(() => {
					    this.router.navigate(['/item/', this.item_id]);
					});
				});
			this.activeModal.close('Comment Created');
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

}
