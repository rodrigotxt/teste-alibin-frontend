import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClienteComponent } from './cliente/cliente.component';

const routes: Routes = [
  	{ path: '', redirectTo: 'cliente', pathMatch: 'full' },
	{ path: 'cliente', component: ClienteComponent },
	{ path: 'cliente/novo', component: ClienteComponent },
	{ path: 'cliente/editar/:id', component: ClienteComponent },
	{ path: 'cliente/view/:id', component: ClienteComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
