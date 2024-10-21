import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-detalle-viaje',
  templateUrl: './detalle-viaje.page.html',
  styleUrls: ['./detalle-viaje.page.scss'],
})
export class DetalleViajePage implements OnInit {

  id: number = 0;
  viaje: any;

  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.id = parseInt(this.activatedRoute.snapshot.paramMap.get("id") || "");

  }

}
