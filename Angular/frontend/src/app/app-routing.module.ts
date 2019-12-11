import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateItemFormComponent } from './create-item-form/create-item-form.component';
import { CreateUserFormComponent } from './create-user-form/create-user-form.component';
import { CreateReservationFormComponent } from './create-reservation-form/create-reservation-form.component';
import { SignInFormComponent } from './sign-in-form/sign-in-form.component';
import { ItemInfoComponent } from './item-info/item-info.component';
import { ItemListComponent } from './item-list/item-list.component';
import { ReservationInfoComponent } from './reservation-info/reservation-info.component';
import { ReservationListComponent } from './reservation-list/reservation-list.component';
import { PageNotFoundComponent} from './pagenotfound/pagenotfound.component';
import { AdminPageComponent} from './adminpage/adminpage.component';
import { ItemDamageListComponent } from './item-damage-list/item-damage-list.component';


const routes: Routes = [
	{ path: 'adminpage', pathMatch: 'full', component:  AdminPageComponent },
	{ path: 'damaged', pathMatch: 'full', component: ItemDamageListComponent },
	{ path: 'signin', pathMatch: 'full', component: SignInFormComponent },
	{ path: 'signup', pathMatch: 'full', component: CreateUserFormComponent },
	{ path: 'createitem', pathMatch: 'full', component: CreateItemFormComponent },
	{ path: 'item/:id', pathMatch: 'full', component: ItemInfoComponent },
	{ path: 'items', pathMatch: 'prefix', component: ItemListComponent },
	{ path: 'reservation/:id', pathMatch: 'full', component: ReservationInfoComponent },
	{ path: 'reservations', pathMatch: 'prefix', component:  ReservationListComponent },
	{ path: 'createreservation/:id', pathMatch: 'full', component:  CreateReservationFormComponent },
	{ path: '**', pathMatch: 'full', component:  PageNotFoundComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
