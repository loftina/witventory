import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { HttpClientModule } from '@angular/common/http'; // add http client module

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CreateUserFormComponent } from './create-user-form/create-user-form.component';
import { CreateItemFormComponent } from './create-item-form/create-item-form.component';
import { SignInFormComponent } from './sign-in-form/sign-in-form.component';
import { ItemInfoComponent } from './item-info/item-info.component';
import { ItemListComponent } from './item-list/item-list.component';
import { ReservationInfoComponent } from './reservation-info/reservation-info.component';
import { ReservationListComponent } from './reservation-list/reservation-list.component';
import { CreateReservationFormComponent } from './create-reservation-form/create-reservation-form.component';
import { PageNotFoundComponent} from './pagenotfound/pagenotfound.component';
import { AdminPageComponent} from './adminpage/adminpage.component';


import {Injectable} from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
  HTTP_INTERCEPTORS
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { ItemDamageListComponent } from './item-damage-list/item-damage-list.component';
import { ItemNoteListComponent } from './item-note-list/item-note-list.component';
import { ItemCommentModalComponent } from './item-comment-modal/item-comment-modal.component';
import { ItemListDamagedComponent } from './item-list-damaged/item-list-damaged.component';
import { ItemShortageListComponent } from './item-shortage-list/item-shortage-list.component';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    intercept(req: HttpRequest<any>,
              next: HttpHandler): Observable<HttpEvent<any>> {

        const idToken = localStorage.getItem("token");

        if (idToken) {
            const cloned = req.clone({
                headers: req.headers.set("Authorization",
                    "Bearer " + idToken)
            });

            return next.handle(cloned);
        }
        else {
            return next.handle(req);
        }
    }
}

@NgModule({
  declarations: [
    AppComponent,
    CreateUserFormComponent,
    CreateItemFormComponent,
    SignInFormComponent,
    ItemInfoComponent,
    ItemListComponent,
    ReservationInfoComponent,
    ReservationListComponent,
    CreateReservationFormComponent,
    PageNotFoundComponent,
    AdminPageComponent,
    ItemDamageListComponent,
    ItemNoteListComponent,
    ItemCommentModalComponent,
    ItemListDamagedComponent,
    ItemShortageListComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    NgbModule
  ],
  entryComponents: [
    CreateReservationFormComponent,
    CreateItemFormComponent,
    ItemCommentModalComponent
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }