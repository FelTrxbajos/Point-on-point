import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, ValidatorFn } from '@angular/forms';
import { FireService } from 'src/app/services/fire.service';


@Component({
  selector: 'app-administrar-fire',
  templateUrl: './administrar-fire.page.html',
  styleUrls: ['./administrar-fire.page.scss'],
})
export class AdministrarFirePage  implements OnInit {
    persona = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+(\s[A-Za-zÁÉÍÓÚáéíóúñÑ]+)*$/)]),
    rut: new FormControl('', [Validators.required, Validators.pattern(/^\d{6,8}-[kK0-9]$/)]),
    gender: new FormControl('', [Validators.required]),
    birthdate: new FormControl('', [Validators.required,]),
    email: new FormControl('', [Validators.required, Validators.pattern("[a-zA-Z0-9._%+-]+@duocuc.cl")]),
    password: new FormControl('',[Validators.required, Validators.pattern("^(?=.*[-!#$%&/()?¡_.])(?=.*[A-Za-z])(?=.*[a-z]).{8,}$")]),
    confirmpassword: new FormControl('',[Validators.required, Validators.pattern("^(?=.*[-!#$%&/()?¡_.])(?=.*[A-Za-z])(?=.*[a-z]).{8,}$")]),
    tiene_auto: new FormControl('no', [Validators.required]),
    patente: new FormControl('', [Validators.pattern(/^[A-Z]{2}[0-9]{4}$|^[A-Z]{4}[0-9]{2}$/)]),
    asientos_disp: new FormControl('', [Validators.min(1)]),
    tipo_usuario: new FormControl('usuario', [Validators.required]),
  });

  usuarios: any[] = [];
  botonModificar: boolean = true;

  constructor(private fireService: FireService) { 
    this.persona.get("rut")?.setValidators([Validators.required,Validators.pattern("[0-9]{7,8}-[0-9kK]{1}"),this.validarRut()]);
  }

  ngOnInit() {
    this.cargarUsuarios();
  }

  validarEdad18(birthdate: string){
    var edad = 0;
    if(birthdate){
      const fecha_date = new Date(birthdate);
      const timeDiff = Math.abs(Date.now() - fecha_date.getTime());
      edad = Math.floor((timeDiff / (1000 * 3600 * 24))/365);
    }
    if(edad>=18){
      return true;
    }else{
      return false;
    }
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

  cargarUsuarios(){
    this.fireService.getUsuarios().subscribe(data=>{
      this.usuarios = data;
    });
  }

  async registrar(){
    if(await this.fireService.crearUsuario(this.persona.value)){
      alert("USUARIO REGISTRADO!");
      this.persona.reset();
    }else{
      alert("ERROR! USUARIO YA EXISTE!");
    }
  }

  async buscar(usuario: any){
    this.persona.setValue(usuario);
    this.botonModificar = false;
  }

  async modificar(){
    this.fireService.updateUsuario(this.persona.value).then(()=>{
      alert("USUARIO MODIFICADO!");
      this.persona.reset();
    }).catch(error=>{
      console.log("ERROR: " + error);
    });
  }

  async eliminar(rut_eliminar:string){
    this.fireService.deleteUsuario(rut_eliminar);
  }
}
