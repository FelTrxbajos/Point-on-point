import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {v4 as uuidv4} from 'uuid';


import * as L from 'leaflet';
import * as G from 'leaflet-control-geocoder';
import 'leaflet-routing-machine';
import { ViajeService } from 'src/app/services/viaje.service';

@Component({
  selector: 'app-reservas',
  templateUrl: './reservas.page.html',
  styleUrls: ['./reservas.page.scss'],
})
export class ReservasPage implements OnInit {

  

  private map: L.Map | undefined;
  private geocoder: G.Geocoder | undefined;
  usuario: any;
  

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

  constructor(private viajeService: ViajeService) { }

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
        console.log(e.latlng.lat);
        console.log(e.latlng.lng);
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
            waypoints: [L.latLng(-33.608552227594245, -70.58039819211703),
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

}
