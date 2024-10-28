import { Component, OnInit } from '@angular/core';
import { ViajeService } from 'src/app/services/viaje.service';

@Component({
  selector: 'app-viaje',
  templateUrl: './viaje.page.html',
  styleUrls: ['./viaje.page.scss'],
})
export class ViajePage implements OnInit {

  viajes: any[] = [];
  constructor(private viajeService: ViajeService) { }

  async ngOnInit() {
    await this.Datos();
}



async Datos() {
  this.viajes = await this.viajeService.getViajes(); 
}

}