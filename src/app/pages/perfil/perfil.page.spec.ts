import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PerfilPage } from './perfil.page';
import { UsuarioService } from 'src/app/services/usuario.service';
import { AlertController } from '@ionic/angular';
import { of } from 'rxjs';

class MockUsuarioService {
  getUsuario() {
    return of({
      nombre: 'Juan Perez',
      email: 'juan.perez@duocuc.cl'
    });
  }
}

class MockAlertController {
  create(options: any) {
    return {
      present: jasmine.createSpy('present'),
      ...options
    };
  }
}

describe('PerfilPage', () => {
  let component: PerfilPage;
  let fixture: ComponentFixture<PerfilPage>;
  let usuarioService: UsuarioService;
  let alertController: AlertController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PerfilPage],
      providers: [
        { provide: UsuarioService, useClass: MockUsuarioService },
        { provide: AlertController, useClass: MockAlertController },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PerfilPage);
    component = fixture.componentInstance;
    usuarioService = TestBed.inject(UsuarioService);
    alertController = TestBed.inject(AlertController);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize usuario from localStorage', () => {
    spyOn(localStorage, 'getItem').and.returnValue('{"name": "Juan Perez", "email": "juan.perez@duocuc.cl"}');
    component.ngOnInit();
    expect(component.usuario).toEqual({ name: 'Juan Perez', email: 'juan.perez@duocuc.cl' });
  });

  it('should handle missing usuario in localStorage gracefully', () => {
    spyOn(localStorage, 'getItem').and.returnValue(null);
    component.ngOnInit();
    expect(component.usuario).toEqual({});
  });

  it('should call alertController.create with the correct parameters', async () => {
    const alertSpy = spyOn(alertController, 'create').and.callThrough();
    const header = 'Test Header';
    const message = 'Test Message';

    await component.presentAlert(header, message);

    expect(alertSpy).toHaveBeenCalledWith({
      header: header,
      message: message,
      buttons: ['Entendido'],
    });
  });

  it('should not fail if localStorage returns invalid JSON', () => {
    spyOn(localStorage, 'getItem').and.returnValue('invalid-json');
    expect(() => component.ngOnInit()).not.toThrow();
    expect(component.usuario).toEqual({});
  });

  it('should display alert with correct header and message', async () => {
    const alertSpy = spyOn(alertController, 'create').and.callThrough();
    await component.presentAlert('Header Test', 'Message Test');
    expect(alertSpy).toHaveBeenCalledWith({
      header: 'Header Test',
      message: 'Message Test',
      buttons: ['Entendido'],
    });
  });

  it('should properly handle null usuario values', () => {
    spyOn(localStorage, 'getItem').and.returnValue(null);
    component.ngOnInit();
    expect(component.usuario).toEqual({});
  });

  it('should support usuario with additional fields', () => {
    spyOn(localStorage, 'getItem').and.returnValue('{"nombre": "Maria Lopez", "email": "maria.lopez@correo.com", "telefono": "123456789"}');
    component.ngOnInit();
    expect(component.usuario).toEqual({ nombre: 'Maria Lopez', email: 'maria.lopez@correo.com', telefono: '123456789' });
  });
});