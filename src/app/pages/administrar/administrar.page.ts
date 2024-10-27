import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, ValidatorFn } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { UsuarioService } from 'src/app/services/usuario.service';


@Component({
  selector: 'app-administrar',
  templateUrl: './administrar.page.html',
  styleUrls: ['./administrar.page.scss'],
})
export class AdministrarPage  implements OnInit {
    persona = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+(\s[A-Za-zÁÉÍÓÚáéíóúñÑ]+)*$/)]),
    rut: new FormControl('', [Validators.required, Validators.pattern(/^\d{6,8}-[kK0-9]$/)]),
    genero: new FormControl('', [Validators.required]),
    birthdate: new FormControl('', [Validators.required,]),
    email: new FormControl('', [Validators.required, Validators.pattern("[a-zA-Z0-9._%+-]+@duocuc.cl")]),
    password: new FormControl('', [Validators.required, Validators.minLength(4)]),
    confirmpassword: new FormControl('', [Validators.required]),
    tiene_auto: new FormControl('no', [Validators.required]),
    patente: new FormControl('', [Validators.pattern(/^[A-Z]{2}[0-9]{4}$|^[A-Z]{4}[0-9]{2}$/)]),
    asientos_disp: new FormControl('', [Validators.min(1)]),
    tipouser: new FormControl('usuario', [Validators.required]),
  });

  usuarios: any[] = [];
  botonModificar: boolean = true;

  constructor(private alertController: AlertController, private usuarioService: UsuarioService) { }


  async ngOnInit() {
    this.usuarios = await this.usuarioService.getUsuarios();
  }

  validarEdad18(fecha_nacimiento: string){
    var edad = 0;
    if(fecha_nacimiento){
      const fecha_date = new Date(fecha_nacimiento);
      const timeDiff = Math.abs(Date.now() - fecha_date.getTime());
      edad = Math.floor((timeDiff / (1000 * 3600 * 24))/365);
    }
    if(edad>=18){
      return true;
    }else{
      return false;
    }
  }


  async registrar(){
    if( !this.validarEdad18(this.persona.controls.birthdate.value || "") ){
      alert("ERROR! debe tener al menos 18 años para registrarse!");
      return;
    }

    if(this.persona.controls.password.value != this.persona.controls.confirmpassword.value){
      alert("ERROR! las contraseñas no coinciden!");
      return;
    }

    if( await this.usuarioService.createUsuario(this.persona.value) ){
      alert("USUARIO CREADO CON ÉXITO!");
      this.persona.reset();
      this.usuarios = await this.usuarioService.getUsuarios();
    }else{
      alert("ERROR! NO SE PUDO CREAR EL USUARIO!");
    }
  }

  async buscar(rut_buscar:string){
    this.persona.setValue(await this.usuarioService.getUsuario(rut_buscar) );
    this.botonModificar = false;
  }

  validarRut():ValidatorFn{
    return () => {
      const rut = this.persona.controls.rut.value;
      const dv_validar = rut?.replace("-","").split("").splice(-1).reverse()[0];
      let rut_limpio = [];
      if(rut?.length==10){
        rut_limpio = rut?.replace("-","").split("").splice(0,8).reverse();
      }else{
        rut_limpio = rut?.replace("-","").split("").splice(0,7).reverse() || [];
      }
      let factor = 2;
      let total = 0;
      for(let num of rut_limpio){
        total = total + ((+num)*factor);
        factor = factor + 1;
        if(factor==8){
          factor = 2;
        }
      }
      var dv = (11-(total%11)).toString();
      if(+dv>=10){
        dv = "k";
      }
      if(dv_validar!=dv.toString()) return {isValid: false};
      return null;
    };
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

  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['Entendido'],
    });
    await alert.present();
  }
}