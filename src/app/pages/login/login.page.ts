import { Component, OnInit } from '@angular/core';
import { RegistrarsePage } from '../registrarse/registrarse.page';
import { RegistrarsePageModule } from '../registrarse/registrarse.module';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  titulo: string = "PÁGINA DE LOGIN";
  numero: number = 5;
  decimal: number = 5.2;
  existe: boolean = true;
  fecha_hoy: Date = new Date();

  correo: string = "";
  contrasena: string = "";


  constructor() { }

  ngOnInit() {
  }

  login(){

  }
}