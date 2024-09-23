import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

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
    if (this.email == "usuario01@duocuc.cl" && this.password =="prueba") { 
      this.router.navigate(['/home']);
    } else {
      await this.presentAlert('Correo o contraseña incorrectos!','');
    }
  }

}
