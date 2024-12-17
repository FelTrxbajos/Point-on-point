import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { UsuarioService } from 'src/app/services/usuario.service';


@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
  usuario: any = {}; 


  constructor(private usuarioService: UsuarioService, private alertController: AlertController) { }

  async ngOnInit() {
    this.usuario = JSON.parse(localStorage.getItem('usuario')  || "");
  }

  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['Entendido'],
    });
    await alert.present();
  }

  dataQR(): string {
    const name = this.usuario.get('name')?.value ?? '';
    const rut = this.usuario.get('rut')?.value ?? '';
    const email = this.usuario.get('email')?.value ?? '';

    return `${name}, ${rut}, ${email}`;
  }
}
