import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.scss']
})
export class ClienteComponent{
	title = 'Cliente'
  dataClientes = [];
  id: number;
  action: string;
  cliente: any;
  displayedColumns: string[] = ['id', 'name', 'tel', 'document'];

  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.cliente = this.route.params.subscribe(params => {
      this.id = +params['id'];
      this.action = params['action'];
    });
  }
  imports:{
  	
  }

}