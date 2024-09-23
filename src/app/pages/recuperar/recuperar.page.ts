import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-recuperar',
  templateUrl: './recuperar.page.html',
  styleUrls: ['./recuperar.page.scss'],
})
export class RecuperarPage implements OnInit {
  user: FormGroup;

  constructor(private alertController: AlertController) {
    this.user = new FormGroup({
      email: new FormControl('', [Validators.required,Validators.pattern("[a-zA-Z0-9._%+-]+@duocuc.cl")])
    });
  }

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


  async submit() {
    if (this.user.valid) {
      await this.presentAlert('Se ha enviado un codigo a su correo electronico','');
      this.user.reset();
    } else {
      await this.presentAlert('Correo no válido','');
    }
  }



}
