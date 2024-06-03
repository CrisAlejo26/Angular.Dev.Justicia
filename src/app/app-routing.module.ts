import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Error404PageComponent } from './shared/pages/error404-page/error404-page.component';
import { isAuthenticatedGuard } from './auth/guards/isAuthenticated.guard';
import { isNotAuthenticatedGuard } from './auth/guards/is-not-Authenticated.guard';

const routes: Routes = [
    {
        path: 'login',
        canActivate: [isNotAuthenticatedGuard],
        loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule),
    },
    {
        path: '404',
        component: Error404PageComponent
    },
        {
        path: 'dashboard',
        canActivate: [ isAuthenticatedGuard ],
        loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
        },
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: '**',
        redirectTo: '404',
        pathMatch: 'full'
    },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
