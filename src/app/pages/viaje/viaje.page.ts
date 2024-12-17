import { Component, OnInit } from '@angular/core';
import { ViajeService } from 'src/app/services/viaje.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-viaje',
  templateUrl: './viaje.page.html',
  styleUrls: ['./viaje.page.scss'],
})
export class ViajePage implements OnInit {
  viajes: any[] = [];
  usuario: any = null;
  usuarioReservado: boolean = false;
  monea: any = {};

  constructor(
    private apiService: ApiService,
    private viajeService: ViajeService,
    private usuarioService: UsuarioService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  async ngOnInit() {
    await this.cargarDatosUsuario();
    await this.cargarViajes();
    this.filtrarViajesNoRecurrentes();
    this.getMonea();
  }

  async getMonea() {
    this.apiService.getmonea().subscribe(
      (data) => {
        console.log(data);  // Verifica la estructura de los datos en la consola
        this.monea = data;  // Almacenamos los datos completos en 'tiempo'
      },
      (error) => {
        console.error('Error al obtener el clima:', error);  // Manejo de errores
      }
    );
  }


  // Carga los datos del usuario desde el localStorage
  private async cargarDatosUsuario() {
    const usuarioData = localStorage.getItem('user');
    if (usuarioData) {
      try {
        this.usuario = JSON.parse(usuarioData);
      } catch (error) {
        console.error('Error al parsear el usuario:', error);
      }
    }
  }

  // Carga la lista de viajes desde el servicio
  private async cargarViajes() {
    try {
      this.viajes = await this.viajeService.getViajes();
    } catch (error) {
      console.error('Error al cargar viajes:', error);
    }
  }

  // Filtra los viajes para excluir los recurrentes del mismo conductor
  private filtrarViajesNoRecurrentes() {
    if (this.usuario && this.usuario.nombre) {
      this.viajes = this.viajes.filter(viaje => viaje.conductor !== this.usuario.nombre);
    }
  }

  // Realiza una reserva en un viaje específico
  async tomarReserva(viajeId: string) {
    if (!viajeId) {
      this.mostrarAlerta('Error', 'El ID del viaje no es válido.');
      return;
    }

    try {
      const viaje = this.viajes.find(v => v.id === viajeId);
      if (!viaje) {
        this.mostrarAlerta('Error', 'El viaje no existe.');
        return;
      }

      // Verifica si el usuario ya está reservado
      const yaReservado = viaje.pasajeros?.some((p: string) => p === this.usuario.rut);
      if (yaReservado) {
        this.mostrarAlerta('Reserva duplicada', 'Ya has reservado este viaje.');
        return;
      }

      // Agrega al usuario como pasajero
      const reservaExitosa = await this.viajeService.agregarPasajero(viajeId, this.usuario.rut);
      if (reservaExitosa) {
        this.mostrarAlerta('Reserva exitosa', 'Tu reserva ha sido realizada con éxito.');
        this.router.navigate(['/detalle-viaje', viajeId]);
      } else {
        this.mostrarAlerta('Error', 'No se pudo realizar la reserva. Inténtalo nuevamente.');
      }
    } catch (error) {
      console.error('Error al tomar reserva:', error);
      this.mostrarAlerta('Error', 'Ocurrió un error al procesar tu reserva.');
    }
  }

  // Muestra un mensaje de alerta
  private async mostrarAlerta(header: string, message: string) {
    const alert = document.createElement('ion-alert');
    alert.header = header;
    alert.message = message;
    alert.buttons = ['OK'];

    document.body.appendChild(alert);
    await alert.present();
  }
}
