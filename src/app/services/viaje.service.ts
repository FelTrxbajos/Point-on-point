import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { AngularFirestore } from '@angular/fire/compat/firestore';


@Injectable({
  providedIn: 'root'
})
export class ViajeService {

  constructor(private storage: Storage, private firestore: AngularFirestore ) { 
    this.initStorage();
  }

  async initStorage(){
    await this.storage.create();
  }

  public async createViaje(viaje: any): Promise<boolean> {
    const id = viaje.id || this.firestore.createId();
    const viajeRef = this.firestore.collection('Viajes').doc(id);

    const docSnapshot = await viajeRef.get().toPromise();
    if (docSnapshot?.exists) {
      return false; // Ya existe un viaje con este ID
    }

    await viajeRef.set(viaje);
    return true;
  }

  
  public async getViaje(id: string): Promise<any | null> {
    const viajeDoc = await this.firestore.collection('Viajes').doc(id).get().toPromise();
    return viajeDoc?.data() || null;
  }
  
  public async getViajes(): Promise<any[]> {
    const viajesSnapshot = await this.firestore.collection('Viajes').get().toPromise();
    return viajesSnapshot?.docs.map(doc => {
      const data = doc.data() as Record<string, any>; // Aseguramos que es un objeto
      return { id: doc.id, ...data };
    }) || [];
  }
  
  public async updateViaje(id: string, nuevoViaje: any): Promise<boolean> {
    const viajeRef = this.firestore.collection('Viajes').doc(id);

    const docSnapshot = await viajeRef.get().toPromise();
    if (docSnapshot?.exists) {
      await viajeRef.update(nuevoViaje);
      return true;
    }

    return false;
  }
  
  public async deleteViaje(id: string): Promise<boolean> {
    const viajeRef = this.firestore.collection('Viajes').doc(id);

    const docSnapshot = await viajeRef.get().toPromise();
    if (docSnapshot?.exists) {
      await viajeRef.delete();
      return true;
    }

    return false;
  }

  

  public async modificar_viaje(id: string, pasajero: any): Promise<boolean>{
    let viajes: any[] = await this.storage.get("viajes") || [];
    let indice: number = viajes.findIndex(v => v.id==id);
    if(indice==-1){
      return false;
    }
    if(viajes[indice].pasajeros.find((pasajero: any) => pasajero.rut == pasajero.rut)){
      return false;
    }
    viajes[indice].pasajeros.push(pasajero);
    viajes[indice].asientos_disp = viajes[indice].asientos_disp - 1;
    await this.storage.set("viajes",viajes);
    return true;
  }

  public async agregarPasajero(viajeId: string, pasajero: any): Promise<boolean> {
    const viajeRef = this.firestore.collection('Viajes').doc(viajeId);

    const docSnapshot = await viajeRef.get().toPromise();
    if (docSnapshot?.exists) {
      const viajeData = docSnapshot.data() as { pasajeros?: any[]; asientos_disp?: number };

      if (viajeData?.asientos_disp && viajeData.asientos_disp > 0) {
        const pasajeros = viajeData.pasajeros || [];
        pasajeros.push(pasajero);

        await viajeRef.update({
          pasajeros,
          asientos_disp: viajeData.asientos_disp - 1,
        });

        return true;
      }
    }

    return false;
  }

  public async cancelarReserva(viajeId: string, usuarioRut: string): Promise<boolean> {
    try {
      const viajeRef = this.firestore.collection('Viajes').doc(viajeId);
      const docSnapshot = await viajeRef.get().toPromise();
  
      if (docSnapshot && docSnapshot.exists) {
        const viajeData = docSnapshot.data() as { pasajeros?: string[]; asientos_disp?: number }; // Aseguramos tipos
        if (viajeData) {
          const pasajeros = Array.isArray(viajeData.pasajeros) ? [...viajeData.pasajeros] : [];
          const asientosDisp = typeof viajeData.asientos_disp === 'number' ? viajeData.asientos_disp : 0;
  
          // Encontramos el índice del usuario
          const pasajeroIndex = pasajeros.indexOf(usuarioRut);
          if (pasajeroIndex !== -1) {
            // Eliminamos al pasajero
            pasajeros.splice(pasajeroIndex, 1);
  
            // Actualizamos los datos en Firestore
            await viajeRef.update({
              pasajeros,
              asientos_disp: asientosDisp + 1,
            });
            return true; // Reserva cancelada con éxito
          } else {
            console.error('El usuario no tiene una reserva en este viaje.');
          }
        }
      }
      return false; // No se pudo cancelar la reserva
    } catch (error) {
      console.error('Error al cancelar la reserva:', error);
      return false;
    }
  }


}
