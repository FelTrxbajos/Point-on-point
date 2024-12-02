import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HomePage } from './home.page';
import { RouterTestingModule } from '@angular/router/testing';

describe('Página Home', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;
  let usuarioPrueba = {
    "rut": "11111111-1",
    "name": "administrador",
    "birthdate": "1980-01-01",
    "gender": "Masculino",
    "email": "admin@duocuc.cl",
    "password": "Admin123.",
    "confirmpassword": "Admin123.",
    "tiene_auto": "no",
    "marca_auto": "SUBARU",
    "tipo_usuario": "Administrador"
  };

  //aqui dentro del beforeEach deben preparar todo lo necesario de la página a testear:
  beforeEach(async () => {
    const localStoragePrueba = {
      getItem: jasmine.createSpy('getItem').and.callFake((key: string)=>{
        if(key==='usuario'){
          return JSON.stringify(usuarioPrueba);
        }
        return null;
      }),
      setItem: jasmine.createSpy('setItem'),
      removeItem: jasmine.createSpy('removeItem')
    };
    Object.defineProperty(window,'localStorage', {value: localStoragePrueba});
    
    await TestBed.configureTestingModule({
      declarations: [HomePage],
      imports: [IonicModule.forRoot(), RouterTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  //it: es una prueba unitaria:
  it('1. Verificar si la página se abre', () => {
    //aquí dentro va lo que deseo probar:
    expect(component).toBeTruthy();
  });

  it('2. Verificar el nombre del usuario', ()=>{
    expect(component.usuario.nombre).toEqual("administrador");
  });

  it('3. Validar el usuario completo', ()=>{
    expect(localStorage.getItem).toHaveBeenCalledWith('usuario');
    expect(component.usuario).toEqual(usuarioPrueba);
  });

});
