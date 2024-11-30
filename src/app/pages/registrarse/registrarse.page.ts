import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Router } from '@angular/router';
import { FireService } from 'src/app/services/fire.service';

@Component({
  selector: 'app-registrarse',
  templateUrl: './registrarse.page.html',
  styleUrls: ['./registrarse.page.scss'],
})
export class RegistrarsePage implements OnInit {

  
  user = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+(\s[A-Za-zÁÉÍÓÚáéíóúñÑ]+("3,0"))*$/)]),
    rut: new FormControl('', [Validators.required, Validators.pattern(/^\d{6,8}-[kK0-9]$/)]),
    email: new FormControl('', [Validators.required, Validators.pattern("[a-zA-Z0-9._%+-]+@duocuc.cl")]),
    birthdate: new FormControl('',[Validators.required]),
    tiene_auto: new FormControl('no', [Validators.required]),
    marca_auto: new FormControl('', [this.validarMarcaAuto.bind(this)]),
    asientos_disp: new FormControl('', []),
    patente: new FormControl('', [Validators.pattern(/^[A-Z]{2}[0-9]{4}$|^[A-Z]{4}[0-9]{2}$/)]),
    gender: new FormControl('', [Validators.required]),
    password: new FormControl('',[Validators.required, Validators.pattern("^(?=.*[-!#$%&/()?¡_.])(?=.*[A-Za-z])(?=.*[a-z]).{8,}$")]),
    confirmpassword: new FormControl('',[Validators.required, Validators.pattern("^(?=.*[-!#$%&/()?¡_.])(?=.*[A-Za-z])(?=.*[a-z]).{8,}$")]),
    tipo_usuario: new FormControl('Alumno')
  }); 

  marca_auto: string[] = [
    'abarth', 'acura', 'alfa romeo', 'audi', 'bmw', 'bentley', 'buick', 'cadillac',
    'chevrolet', 'citroën', 'dodge', 'fiat', 'ford', 'genesis', 'honda', 'hyundai',
    'infiniti', 'jaguar', 'jeep', 'kia', 'lamborghini', 'land rover', 'lexus',
    'lincoln', 'maserati', 'mazda', 'mclaren', 'mercedes benz', 'mini', 'mitsubishi',
    'nissan', 'pagani', 'peugeot', 'porsche', 'ram', 'renault', 'rolls royce',
    'saab', 'seat', 'skoda', 'smart', 'subaru', 'suzuki', 'tesla', 'toyota',
    'volkswagen', 'volvo', 'byd', 'jac', 'changan', 'great wall'
  ];


  constructor(private router: Router, private usuarioService: UsuarioService, private fireService: FireService) {
    this.user.get("rut")?.setValidators([Validators.required,Validators.pattern("[0-9]{7,8}-[0-9kK]{1}"),this.validarRut()]);
   }

  ngOnInit() {
  }
  
  public async registrar(){
    if( !this.validarEdad18(this.user.controls.birthdate.value || "") ){
      alert("ERROR! debe tener al menos 18 años para registrarse!");
      return;
    }
    
    if(this.user.controls.password.value != this.user.controls.confirmpassword.value){
      alert("ERROR! las contraseñas no coinciden!");
      return;
    }

      if(await this.fireService.crearUsuario(this.user.value)){
        alert("USUARIO REGISTRADO!");
        this.user.reset();
      }else{
        alert("ERROR! USUARIO YA EXISTE!");
      
    }
  }

  passwordMatchValidator(formGroup: AbstractControl): ValidationErrors | null {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmpassword')?.value;
    return password && confirmPassword && password !== confirmPassword ? { passwordsDoNotMatch: true } : null;
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
      const rut = this.user.controls.rut.value;
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

  validarMarcaAuto(control: AbstractControl) {
    const marca_auto = control.value ? control.value.toLowerCase() : '';
    if (marca_auto && !this.marca_auto.includes(marca_auto)) {
      return { marcaNoExiste: true };
    }
    return null;
  }

  
}

