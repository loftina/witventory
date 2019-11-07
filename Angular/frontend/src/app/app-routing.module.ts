import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginFormComponent } from "./login-form/login-form.component";
import { HomepageComponent } from "./homepage/homepage.component";
import { ForgotPasswordComponent } from "./forgot-password/forgot-password.component";
import { RegisterComponent } from "./register/register.component";
import { AdminComponent } from "./admin/admin.component";




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

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
