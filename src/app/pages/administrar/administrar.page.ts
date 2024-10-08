import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators, ValidatorFn } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { UsuarioService } from 'src/app/services/usuario.service';


@Component({
  selector: 'app-administrar',
  templateUrl: './administrar.page.html',
  styleUrls: ['./administrar.page.scss'],
})
export class AdministrarPage  implements OnInit {
    persona = new FormGroup({
    nombre: new FormControl('', [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+(\s[A-Za-zÁÉÍÓÚáéíóúñÑ]+)*$/)]),
    rut: new FormControl('', [Validators.required, Validators.pattern(/^\d{6,8}-[kK0-9]$/)]),
    genero: new FormControl('', [Validators.required]),
    fecha_nacimiento: new FormControl('', [Validators.required, this.anosvalidar(18, 100)]),
    correo: new FormControl('', [Validators.required, Validators.pattern("[a-zA-Z0-9._%+-]+@duocuc.cl")]),
    password: new FormControl('', [Validators.required, Validators.minLength(4)]),
    tiene_auto: new FormControl('no', [Validators.required]),
    patente: new FormControl('', [Validators.pattern(/^[A-Z]{2}[0-9]{4}$|^[A-Z]{4}[0-9]{2}$/)]),
    asientos_disp: new FormControl('', [Validators.min(1)]),
    tipouser: new FormControl('usuario', [Validators.required]),
  });

  usuarios: any[] = [];

  constructor(private alertController: AlertController, private usuarioService: UsuarioService) { }


  async ngOnInit() {
    this.usuarios = await this.usuarioService.getUsuarios();
  }

  async registrar() {
    if (await this.usuarioService.createUsuario(this.persona.value)) {
      await this.presentAlert('Perfecto', 'Registrado correctamente');
      this.persona.reset();
      this.usuarios = await this.usuarioService.getUsuarios();
      
    } else {
      await this.presentAlert('Error', 'El usuario no se pudo registrar');
      
    }
  }

  buscar(usuario: any) {
    this.persona.patchValue(usuario);
  }

  async eliminar(rut: string) {
    if (await this.usuarioService.deleteUsuario(rut)) {
      this.usuarios = await this.usuarioService.getUsuarios();
      
    }
  }

  async modificar() {
    var rut_modificar = this.persona.controls.rut.value || "";
    if (await this.usuarioService.updateUsuario(rut_modificar, this.persona.value)) {
      this.presentAlert('Perfecto!', 'Modificado correctamente');
      this.usuarios = await this.usuarioService.getUsuarios();
    } else {
      this.presentAlert('Error!', 'No se pudo modificar');
      
    }
  }
  anosvalidar(minAge: number, maxAge: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const birthDate = new Date(control.value);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      return (age >= minAge && age <= maxAge) ? null : { 'invalidAge': true };
    };
  }

  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['Entendido'],
    });
    await alert.present();
  }
}