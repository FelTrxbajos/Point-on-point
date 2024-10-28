import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private usuarioAutenticado: any = null;

  constructor(private storage :Storage) {
    this.init();
  }

  async init(){
    await this.storage.create();
    let usuario = {
        "name": "admin",
        "rut": "16666666-6",
        "birthdate": "1990-03-24",
        "gender": "Masculino",
        "email": "admin@duocuc.cl",
        "password": "Admin123.",
        "confirmpassword": "Admin123.",
        "tipo_usuario": "Administrador",
        "tiene_auto": "si",
        "marca_auto": "BMW",
        "asientos_disp": "2",
        "patente": "XXPP32",
    };
    await this.createUsuario(usuario);
  }


  //DAO
  public async createUsuario(usuario:any): Promise<boolean>{
    let usuarios: any[] = await this.storage.get("usuarios") || [];
    if(usuarios.find(usu=>usu.rut==usuario.rut)!=undefined){
      return false;
    }
    usuarios.push(usuario);
    await this.storage.set("usuarios",usuarios);
    return true;
  }

  public async getUsuario(rut:string): Promise<any>{
    let usuarios: any[] = await this.storage.get("usuarios") || [];
    return usuarios.find(usu=>usu.rut==rut);
  }

  public async getUsuarios(): Promise<any[]>{
    let usuarios: any[] = await this.storage.get("usuarios") || [];
    return usuarios;
  }

  public async updateUsuario(rut: string, nuevoUsuario: any) {
    let usuarios: any[] = await this.storage.get("usuarios") || [];
    let indice: number = usuarios.findIndex(usu=>usu.rut==rut);
    if(indice == -1){
      return false;
    }
    usuarios[indice] = nuevoUsuario;
    await this.storage.set("usuarios",usuarios);
    return true;
  }

  public async deleteUsuario(rut: string): Promise<boolean> {
    let usuarios: any[] = await this.storage.get("usuarios") || [];
    let indice: number = usuarios.findIndex(usu=>usu.rut==rut);
    if(indice == -1){
      return false;
    }
    usuarios.splice(indice,1);
    await this.storage.set("usuarios",usuarios);
    return true;
  }

  public async login(email: string, password: string): Promise<any> {
    let usuarios: any[] = await this.storage.get("usuarios") || [];
    const usu = usuarios.find(elemento=> elemento.email == email && elemento.password == password);
    if(usu){
      localStorage.setItem("usuario", JSON.stringify(usu));
      return true;
    }
    return false;
  }

  public async authenticate(email: string, password: string): Promise<boolean> {
    try {
      const usuarios: any[] = await this.getUsuarios();
      const usuario = usuarios.find(user => user.email === email && user.password === password);
      if (usuario) {
        this.usuarioAutenticado = usuario;
        localStorage.setItem('user', JSON.stringify(usuario));
        return true; 
      }
      return false; 
    } catch (error) {
      console.error('Error al autenticar:', error);
      return false;
    }
  }

  public async recuperarUsuario(email: string): Promise<any> {
    let usuarios: any[] = await this.storage.get("usuarios") || [];
    return usuarios.find(elemento=> elemento.email == email);
  }

  public async getUsuarioAutenticado(): Promise<any> {
    if (!this.usuarioAutenticado) {
      const userData = localStorage.getItem('user');
      if (userData) {
        this.usuarioAutenticado = JSON.parse(userData);
      }
    }
    return this.usuarioAutenticado;
  }
}

  