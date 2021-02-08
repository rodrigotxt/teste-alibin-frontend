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
  produtos: any[] = [];
  produtoSelect: string;
  estados: [];
  cidades: [];
  clientes: string[] = [];
  id: any;
  action: string;
  cliente: any;
  clienteActive: any;
  numClientes: any;
  displayedColumns: string[] = ['id', 'name', 'tel', 'cpf', 'options'];
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  constructor(private router: Router, private route: ActivatedRoute, private _formBuilder: FormBuilder,  private localforage: LocalForageService, private http: HttpClient) { }

  ngOnInit(){
    this.cliente = this.route.params.subscribe(params => {
      this.id = +params['id'];
      this.action = params['action'];
      if(this.action == 'ver' || this.action == 'editar'){
        this.clienteActive = this.getCliente(this.id, true);
      }
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
    this.getProdutos();
  }
  getProdutos(){
    let cods = [3896,3353,5882,3984,16692,17876,18563,11317,3108,12618,13787,16411];
    let letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    let produtos = [];
    for (var i = cods.length - 1; i >= 0; i--) {
      let productName = 'Produto ' + letters[Math.floor(Math.random() * letters.length)] + letters[Math.floor(Math.random() * letters.length)];
      let produto = {};
      produto['cod'] = cods[i];
      produto['name'] = productName;
      produto['preco'] =  'R$ ' + Math.floor(Math.random() * 100 + 10) + ',00'; // numero aletorio
      this.produtos.push(produto);
    }
    // return this.produtos;
  }
  addProduto(produto){
    let cliente = this.clienteActive;
    cliente['itens'].push(produto);
    this.localforage.setItem(cliente.id, cliente);
  }
  deleteProduto(index){
   this.clienteActive['itens'].splice(index, 1); 
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
      if(this.clienteActive){

      }
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
  editarCliente(id){
    this.router.navigate(['/cliente/editar/' + id]);
  }
  getCliente(id, active = false){    
    this.localforage.getItem(id).subscribe(res => {
      this.clientes.push(res);
      this.dataClientes.push(res);
      this.dataClientes = [...this.dataClientes];
      if(active){
        this.clienteActive = res;
        this.getCidades({value: res.uf});
      };
    });
  }
  verCliente(cliente){
    this.router.navigate(['/cliente/ver/' + cliente.id]);
  }
  deleteCliente(id){
    console.log('remove', id);
    this.localforage.removeItem(id).subscribe(res => {
      this.reloadClientes(true);
    });
  }

  saveCliente(update = false){
    let id = this.numClientes + 1;
    let dados = {};
    if(update){
      id = this.clienteActive.id;
      dados = this.clienteActive;
    }else{
    let form1 = this.firstFormGroup.value;
    form1.id = id;
    form1.itens = [];
    let form2 = this.secondFormGroup.value;
    dados = {...form1, ...form2};      
    }
    this.localforage.setItem(id, dados).subscribe(res => {
      this.getCliente(id);
      this.router.navigate(['/cliente/ver/' + id]);
    });
  }
  imports:{
    HttpClient
  }

}