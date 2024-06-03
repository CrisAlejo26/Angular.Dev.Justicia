import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";;
import { LoginComponent } from "./login/login.component";
import { CommonModule } from "@angular/common";

// localhost:4200/auth/
const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
  ],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
