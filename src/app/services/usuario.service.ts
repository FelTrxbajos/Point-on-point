import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private usuarioAutenticado: any = null;
  constructor(private storage: Storage, private firestore: AngularFirestore, private afAuth: AngularFireAuth) {
    this.initStorage();
  }

  async initStorage() {
    await this.storage.create();
    await this.ensureDefaultUsers();
  }

  // Método para asegurar que siempre exista un usuario 'administrador'
  private async ensureDefaultUsers() {
    // Obtener la lista de usuarios
    let usuarios: any[] = await this.storage.get("usuarios") || [];
  
    // Verificar si el usuario 'administrador' ya existe
    const adminExists = usuarios.find(usu => usu.tipo_usuario === 'Administrador');
    // Crear usuario administrador si no existe
    if (!adminExists) {
      const admin = {
        rut: '11111111-1',
        name: 'Alan',
        gender: 'Masculino',
        email: 'admin@duocuc.cl',
        password: 'Admin123.',
        birthdate: '19-09-1990',
        confirmpassword: 'Admin123.',
        tipo_usuario: 'Administrador',
        marca_auto: 'SUBARU',
        asientos_disp: '3',
        patente: 'FHYA9',

      };
      usuarios.push(admin);
      console.log('Usuario administrador creado');
    } else {
      console.log('Usuario administrador ya existe');
    }
// Guardar la lista de usuarios actualizada en Storage
  await this.storage.set("usuarios", usuarios);
  }
  //DAO
  public async createUsuario(usuario: any): Promise<boolean> {
    let usuarios: any[] = await this.storage.get("usuarios") || [];
    if (usuarios.find(usu => usu.rut == usuario.rut) != undefined) {
      return false;
    }
    usuarios.push(usuario);
    await this.storage.set("usuarios", usuarios);
    return true;
  }

  public async getUsuario(rut: string): Promise<any | null> {
    try {
      const usuariosSnapshot = await this.firestore.collection('Usuarios', ref => ref.where('rut', '==', rut)).get().toPromise();
      if (!usuariosSnapshot || usuariosSnapshot.empty) {
        console.error('Usuario no encontrado o error en Firestore.');
        return null;
      }
      const usuarios = usuariosSnapshot.docs.map(doc => doc.data() as any);
      return usuarios.length > 0 ? usuarios[0] : null;
    } catch (error) {
      console.error('Error al obtener usuario:', error);
      return null;
    }
  }
  public async getUsuarios(): Promise<any[]>{
    let usuarios: any[] = await this.storage.get("usuarios") || [];
    return usuarios;
  }

  public async updateUsuario(rut: string, nuevoUsuario: any): Promise<boolean> {
    try {
      // Buscar documentos donde el campo 'rut' coincida
      const usuariosSnapshot = await this.firestore.collection('Usuarios', ref => ref.where('rut', '==', rut)).get().toPromise();
      if (!usuariosSnapshot || usuariosSnapshot.empty) {
        console.error(`No se encontró ningún usuario con el rut: ${rut}`);
        return false;
      }
      const docId = usuariosSnapshot.docs[0].id;

      await this.firestore.collection('Usuarios').doc(docId).update(nuevoUsuario);
  
      console.log(`Usuario con rut ${rut} actualizado correctamente.`);
      return true;
    } catch (error) {
      console.error('Error al actualizar usuario en Firestore:', error);
      return false;
    }
  }

  public async deleteUsuario(rut: string): Promise<boolean> {
    try {
      const usuariosSnapshot = await this.firestore.collection('Usuarios', ref => ref.where('rut', '==', rut)).get().toPromise();
      if (!usuariosSnapshot || usuariosSnapshot.empty) {
        return false;
      }
      const docId = usuariosSnapshot.docs[0].id;
      await this.firestore.collection('Usuarios').doc(docId).delete();
      return true;
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      return false;
    }
  }

  

  public async authUsuario(rut: string, contrasena: string): Promise<any> {
    let usuarios: any[] = await this.storage.get("usuarios") || [];
    const usuarioAuth = usuarios.find(usu => usu.rut == rut && usu.contrasena == contrasena);
    if (usuarioAuth) {
      localStorage.setItem("usuario", JSON.stringify(usuarioAuth));
      return true;
    }
    return false;
  }

  public async recuperarUsuario(email: string): Promise<any> {
    let usuarios: any[] = await this.storage.get("usuarios") || [];
    return usuarios.find(elemento=> elemento.email == email);
  }

  public async recoverUsuario(correo: string): Promise<any> {
    let usuarios: any[] = await this.storage.get("usuarios") || [];
    return usuarios.find(usu => usu.correo == correo);
  }

  public async getUsuarioAutenticado(): Promise<any | null> {
    if (!this.usuarioAutenticado) {
      const user = await this.afAuth.currentUser;
      console.log("usuario", user);
      if (user) {
        console.log("usuario", user);
        const usuarioId = user.uid;
        const usuarioRef = this.firestore.collection('Usuarios').doc(usuarioId);
        const usuarioDoc = await usuarioRef.get().toPromise();
        if (usuarioDoc && usuarioDoc.exists && usuarioDoc.data()) {
          this.usuarioAutenticado = usuarioDoc.data();
          console.log("usuario autenticado", this.usuarioAutenticado);
        }
      }
    }
    return this.usuarioAutenticado;
  }
}

  