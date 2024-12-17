import { Component, OnInit } from '@angular/core';
import { ViajeService } from 'src/app/services/viaje.service';

@Component({
  selector: 'app-detalle-viaje',
  templateUrl: './detalle-viaje.page.html',
  styleUrls: ['./detalle-viaje.page.scss'],
})
export class DetalleViajePage implements OnInit {
  viajes: any[] = [];
  usuario: any;
  viajeConUsuario: any;

  constructor(private viajeService: ViajeService) {}

  async ngOnInit() {
    await this.Datos();
    await this.activarRecurrente();
    this.viajeConUsuario = this.buscarCoincidencia()
    console.log(this.viajeConUsuario)
  }

  async Datos() {
    this.viajes = await this.viajeService.getViajes();
    this.usuario = JSON.parse(localStorage.getItem("user") || '');
  }
  
  async activarRecurrente() {
    this.viajes = await this.viajeService.getViajes(); 
    console.log(this.viajes.indexOf(this.usuario.rut))
    this.viajes = this.viajes.filter(viaje => viaje.conductor != this.usuario.nombre);

}

 

  async cancelarReserva(viajeId: string) {
    const cancelado = await this.viajeService.cancelarReserva(viajeId, this.usuario.rut);
    if (cancelado) {
      alert('Reserva cancelada con éxito.');
      window.location.reload();
    } else {
      alert('No se pudo cancelar la reserva. Inténtalo de nuevo.');
    }
  }

buscarCoincidencia() {
  for (let viaje of this.viajes) {
    if (viaje.pasajeros.indexOf(this.usuario.rut) !== -1) {
      return viaje;
    }
  }
  return null;
}

}