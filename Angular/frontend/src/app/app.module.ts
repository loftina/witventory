import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

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

@NgModule({
  declarations: [
    AppComponent,
    CreateUserFormComponent,
    CreateItemFormComponent,
    SignInFormComponent,
    ItemInfoComponent,
    ItemListComponent,
    ReservationInfoComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }