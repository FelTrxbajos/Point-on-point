import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  email: string ="";
  password: string="";

  constructor(private router: Router, private alertController: AlertController) { }

  ngOnInit() {
  }


  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK'],
    });
    await alert.present();
  }

  
  async login() {
    if (this.email == "prueba@duocuc.cl" && this.password =="hola123") { 
      this.router.navigate(['/home']);
    } else {
      await this.presentAlert('Correo o contraseña incorrectos!','');
    }
  }
}
