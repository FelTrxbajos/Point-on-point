import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {

  usuario: any;

  constructor() { }

  ngOnInit() {

    this.usuario = JSON.parse(localStorage.getItem("usuario")  || "");
  }

}
