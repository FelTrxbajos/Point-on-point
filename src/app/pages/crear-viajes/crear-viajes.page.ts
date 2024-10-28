import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {v4 as uuidv4} from 'uuid';

//lo primero es agregar un import:
import * as L from 'leaflet';
import * as G from 'leaflet-control-geocoder';
import 'leaflet-routing-machine';
import { ViajeService } from 'src/app/services/viaje.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-crear-viajes',
  templateUrl: './crear-viajes.page.html',
  styleUrls: ['./crear-viajes.page.scss'],
})
export class CrearViajesPage implements OnInit {


  private map: L.Map | undefined;
  private geocoder: G.Geocoder | undefined;
  usuario: any;
  siEdita = false;

  viaje = new FormGroup({
    id: new FormControl('',[Validators.required]),
    conductor: new FormControl('',[Validators.required]),
    asientos_disp: new FormControl('',[Validators.required]),
    valor: new FormControl('',[Validators.required]),
    nombre_destino: new FormControl('',[Validators.required]),
    latitud: new FormControl('',[Validators.required]),
    longitud: new FormControl('',[Validators.required]),
    distancia_metros: new FormControl('',[Validators.required]),
    tiempo_minutos: new FormControl(0,[Validators.required]),
    estado_viaje: new FormControl('pendiente'),
    pasajeros: new FormControl([])
  });
  viajes: any[] = [];
 

  constructor(private usuarioService: UsuarioService, private viajeService: ViajeService,  private alertController: AlertController) { }

  async ngOnInit() {
    this.usuario = JSON.parse(localStorage.getItem("usuario") || '');
    this.viaje.controls.conductor.setValue(this.usuario.name);
    await this.rescatarViajes();
  }

  initMap(){
    try {
      this.map = L.map("map_html").locate({setView:true, maxZoom:16});
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(this.map);
  
      this.map.on('locationfound', (e)=>{
        
      });
      
  
      this.geocoder = G.geocoder({
        placeholder: "Ingrese dirección a buscar",
        errorMessage: "Dirección no encontrada"
      }).addTo(this.map);
  

      this.geocoder.on('markgeocode', (e)=>{

        let lat = e.geocode.properties['lat'];
        let lon = e.geocode.properties['lon'];
        this.viaje.controls.nombre_destino.setValue(e.geocode.properties['display_name']);
        
        this.viaje.controls.id.setValue(uuidv4());
        this.viaje.controls.latitud.setValue(lat);
        this.viaje.controls.longitud.setValue(lon);
        
        if(this.map){
          L.Routing.control({
            waypoints: [L.latLng(-33.59834375360674, -70.57859259302508),
              L.latLng(lat,lon)],
              fitSelectedRoutes: true,
            }).on('routesfound', (e)=>{
              this.viaje.controls.distancia_metros.setValue(e.routes[0].summary.totalDistance);
              this.viaje.controls.tiempo_minutos.setValue(Math.round(e.routes[0].summary.totalTime/60));
          }).addTo(this.map);
        }
      });
    } catch (error) {
    }
  }

  async crearViaje(){
    if(await this.viajeService.createViaje(this.viaje.value)){
      alert("VIAJE CREADO!");
      this.viaje.reset();
      await this.rescatarViajes();
    }
  }

  async rescatarViajes(){
    this.viajes = await this.viajeService.getViajes();
  }

  async actualizarViaje() {
    const viajeId = this.viaje.controls.id.value; 
    if (!viajeId) {
        alert("El ID del viaje no puede estar vacío.");
        return; 
    }
    if (await this.viajeService.updateViaje(viajeId, this.viaje.value)) {
        alert("Viaje actualizado!");
        await this.rescatarViajes();
        this.viaje.reset();  
    } else {
        alert("No se puede modificar el destino del viaje");
    }
}


  async eliminarViaje(id: string) {
    if (await this.viajeService.deleteViaje(id)) {
      await this.rescatarViajes();
      const alert = await this.alertController.create({
        header: 'viaje eliminado',
        message: 'El viaje ha sido eliminado con éxito.',
        buttons: [
          {
            text: 'OK',
            handler: () => {
              this.eliminarViaje(id);
            },
          },
        ],
      });
      await alert.present();
      this.viaje.reset();  
    } else {
    }
  }

  async confirmarEliminacionViaje(id: string) {
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación de viaje',
      message: '¿Estás seguro que quieres eliminar este viaje?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.eliminarViaje(id);
          },
        },
      ],
    });
    await alert.present();
  }


  buscar(viaje: any) {
    this.siEdita = true;
    this.viaje.patchValue(viaje);
  }

  async obtenerUsuario() {
    this.usuario = await this.usuarioService.getUsuarioAutenticado();
  }
  
}