import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registrarse',
  templateUrl: './registrarse.page.html',
  styleUrls: ['./registrarse.page.scss'],
})
export class RegistrarsePage implements OnInit {

  Usuario = new FormGroup({
    rut: new FormGroup('', [Validators.required,Validators.pattern("[0-9]{7,8}-[0-9kK]{1}")]),
    nombre: new FormControl('',[Validators.required,Validators.pattern("[a-z]{2,20}")]),
    apellido: new FormControl('',[Validators.required,Validators.pattern("[a-z]{2,20}")]),
    genero: new FormControl('',[Validators.required]),
    sede: new FormControl ('',[Validators.required]),
    Carrera: new FormControl('',[Validators.required]),
    fecha_nacimiento: new FormControl('',[Validators.required]),
    direccion: new FormControl('',[Validators.required]),
    correo: new FormControl('',[Validators.required,Validators.pattern("([a-zA-Z0-9]([^ @&%$\\\/()=?¿!.,:;]?|\d?)+[a-zA-Z0-9][\.]){1,2}")]),
    contrasena: new FormControl('',[Validators.required])
  })

  public alertButtons =[
    {
      text: 'Cancelar',
      role: 'cancelar',
      handler: () => {
        console.log('Alert canceled');
      }
    },
    {
      text: 'bien',
      role: 'Confirmacion',
      handler: () => {
        console.log('Alert confirmado')
      }
    }
  ]

  constructor(private router: Router) { }

  ngOnInit() {
  }

  public registro():void{
    console.log(this.Usuario.value);
    this.router.navigate(['/login']);
  }

  setResult(ev:any){
    console.log(`Dismissed with role: ${ev.detail.role}`);
  }

}
