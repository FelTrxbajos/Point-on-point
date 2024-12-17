import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{

  //Vamos a crear una variable que almacenará la informacion de localStorage
  usuario: any;
  tiempo: any = {};

  constructor(private navController: NavController, private apiService: ApiService) {}

  ngOnInit(){
    this.usuario = JSON.parse(localStorage.getItem("usuario")  || "");
    this.getWeather();
  }

  logout(){
    localStorage.removeItem('usuario');
    this.navController.navigateRoot('/login');
  }

  getWeather() {
    this.apiService.getTiempo().subscribe(
      (data) => {
        console.log(data);  // Verifica la estructura de los datos en la consola
        this.tiempo = data;  // Almacenamos los datos completos en 'tiempo'
      },
      (error) => {
        console.error('Error al obtener el clima:', error);  // Manejo de errores
      }
    );
  }

}




