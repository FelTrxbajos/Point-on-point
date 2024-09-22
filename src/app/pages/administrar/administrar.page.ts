import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-administrar',
  templateUrl: './administrar.page.html',
  styleUrls: ['./administrar.page.scss'],
})
export class AdministrarPage implements OnInit {
  persona = new FormGroup({
    rut: new FormControl('',[Validators.minLength(9),Validators.maxLength(10),Validators.required]),
    nombre: new FormControl('',[Validators.required,Validators.pattern("[a-z,A-Z]{3,9}")]),
    fecha_nacimiento: new FormControl('',[Validators.required]),
    //VALIDAR!! FECHA NACIMIENTO
    genero: new FormControl('',[Validators.required]),
    tiene_equipo: new FormControl('no',Validators.required),
    nombre_equipo: new FormControl('',[])
  });
    
  constructor() { }

  ngOnInit() {
  }

}
