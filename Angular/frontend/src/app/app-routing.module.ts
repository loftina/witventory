import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateItemFormComponent } from './create-item-form/create-item-form.component';
import { CreateUserFormComponent } from './create-user-form/create-user-form.component';
import { SignInFormComponent } from './sign-in-form/sign-in-form.component';
import { ItemInfoComponent } from './item-info/item-info.component';
import { ItemListComponent } from './item-list/item-list.component';
import { ReservationInfoComponent } from './reservation-info/reservation-info.component';

const routes: Routes = [
	{ path: '', pathMatch: 'full', component: SignInFormComponent },
	{ path: 'signup', pathMatch: 'full', component: CreateUserFormComponent },
	{ path: 'createitem', pathMatch: 'full', component: CreateItemFormComponent },
	{ path: 'item/:id', pathMatch: 'full', component: ItemInfoComponent },
	{ path: 'items', pathMatch: 'prefix', component: ItemListComponent },
	{ path: 'reservation/:id', pathMatch: 'full', component: ReservationInfoComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
