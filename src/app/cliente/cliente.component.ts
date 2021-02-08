import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { LocalForageService } from 'ngx-localforage';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.scss']
})

export class ClienteComponent implements OnInit {
	title = 'Cliente'
  dataClientes: any[] = [];
  estados: [];
  cidades: [];
  clientes: string[] = [];
  id: number;
  action: string;
  cliente: any;
  clienteActive: {};
  numClientes: any;
  displayedColumns: string[] = ['id', 'name', 'tel', 'cpf', 'options'];
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  constructor(private router: Router, private route: ActivatedRoute, private _formBuilder: FormBuilder,  private localforage: LocalForageService, private http: HttpClient) { }

  ngOnInit(){
    this.cliente = this.route.params.subscribe(params => {
      this.id = +params['id'];
      this.action = params['action'];
    });
    this.firstFormGroup = this._formBuilder.group({
      id: '',
      name: ['', Validators.required],
      tel: ['', Validators.required],
      cpf: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      logradouro: ['', Validators.required],
      cidade: ['', Validators.required],
      uf: ['', Validators.required]
    });
    this.reloadClientes();
    this.getEstados();

  }
  getEstados(){
    return this.http.get<any>('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
    .subscribe(data => {
      this.estados = data.sort((a,b) => (a.sigla > b.sigla) ? 1 : -1);
    }),
    err => {
      console.log(err);
    }
  }
  getCidades(e){
    return this.http.get<any>('https://servicodados.ibge.gov.br/api/v1/localidades/estados/' + e.value + '/municipios')
    .subscribe(data => {
      this.cidades = data.sort((a,b) => (a.nome > b.nome) ? 1 : -1);
    }),
    err => {
      console.log(err);
    }
  }
  reloadClientes(clear = false){
    this.clientes = [];
    this.localforage.keys().subscribe(keys => {
      this.numClientes = keys.length;
      for (var i = keys.length - 1; i >= 0; i--) {
        this.getCliente(keys[i]);
        // this.dataClientes = this.clientes;
      }
    });
  }
  getCliente(id){    
    this.localforage.getItem(id).subscribe(res => {
      this.clientes.push(res);
      this.dataClientes.push(res);
      this.dataClientes = [...this.dataClientes];
    });
  }
  verCliente(cliente){
    this.clienteActive = cliente;
    this.router.navigate(['/cliente/ver/' + cliente.id]);
  }
  deleteCliente(id){
    console.log('remove', id);
    this.localforage.removeItem(id).subscribe(res => {
      this.reloadClientes(true);
    });
  }

  saveCliente(){
    let id = this.numClientes + 1;
    let form1 = this.firstFormGroup.value;
    form1.id = id;
    let form2 = this.secondFormGroup.value;
    let dados = {...form1, ...form2};
    this.localforage.setItem(id, dados).subscribe(res => {
      this.getCliente(id);
      this.router.navigate(['/cliente']);
    });
  }
  imports:{
    HttpClient
  }

}