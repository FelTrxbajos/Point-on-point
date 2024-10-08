import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
@Component({
  selector: 'app-reservas',
  templateUrl: './reservas.page.html',
  styleUrls: ['./reservas.page.scss'],
})
export class ReservasPage implements OnInit {

  private map : L.Map | undefined;

  constructor() { }

  ngOnInit() {
    this.initMap()
  }

  initMap(){
    //this.map = L.map("map_html").locate({setView:true, maxZoom:16});
    this.map = L.map("map.html").setView([-33.583700178857434, -70.56156402421006],16);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.map);
  }

}
