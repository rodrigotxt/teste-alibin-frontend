import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClienteComponent } from './cliente/cliente.component';

const routes: Routes = [
  	{ path: '', redirectTo: 'cliente', pathMatch: 'full' },
	{ path: 'cliente', component: ClienteComponent },
	{ path: 'cliente/:action', component: ClienteComponent },
	{ path: 'cliente/:action/:id', component: ClienteComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
