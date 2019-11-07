import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginFormComponent } from "./login-form/login-form.component";
import { HomepageComponent } from "./homepage/homepage.component";
import { ForgotPasswordComponent } from "./forgot-password/forgot-password.component";
import { RegisterComponent } from "./register/register.component";
import { AdminComponent } from "./admin/admin.component";

import { CreateItemFormComponent } from './create-item-form/create-item-form.component';
import { CreateUserFormComponent } from './create-user-form/create-user-form.component';
import { CreateReservationFormComponent } from './create-reservation-form/create-reservation-form.component';
import { SignInFormComponent } from './sign-in-form/sign-in-form.component';
import { ItemInfoComponent } from './item-info/item-info.component';
import { ItemListComponent } from './item-list/item-list.component';
import { ReservationInfoComponent } from './reservation-info/reservation-info.component';
import { ReservationListComponent } from './reservation-list/reservation-list.component';


<<<<<<< HEAD

const routes: Routes = [

		{
			path: "login",
			component: LoginFormComponent	
		},
		{
			path: '',
			component: HomepageComponent

		},
		{
			path: "register",
			component: RegisterComponent
		},
		{
			path: "forgotpass",
			component: ForgotPasswordComponent 
		},
		{
			path: "admin",
			component: AdminComponent
		}

=======
const routes: Routes = [
	{ path: '', pathMatch: 'full', component: ItemListComponent },
	{ path: 'signin', pathMatch: 'full', component: SignInFormComponent },
	{ path: 'signup', pathMatch: 'full', component: CreateUserFormComponent },
	{ path: 'createitem', pathMatch: 'full', component: CreateItemFormComponent },
	{ path: 'item/:id', pathMatch: 'full', component: ItemInfoComponent },
	{ path: 'items', pathMatch: 'prefix', component: ItemListComponent },
	{ path: 'reservation/:id', pathMatch: 'full', component: ReservationInfoComponent },
	{ path: 'reservations', pathMatch: 'prefix', component:  ReservationListComponent },
	{ path: 'createreservation/:id', pathMatch: 'full', component:  CreateReservationFormComponent }
>>>>>>> 9b04f7df266550f31593e882cd097f1f99a73cc0
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
