import { Component, inject, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Actuaciones, RespuestaActuaciones } from '../../../interfaces';
import { environment } from '../../../environments/environments';
import { DashboardService } from '../dashboard.service';

@Component({
  selector: 'app-actuaciones',
  templateUrl: './actuaciones.component.html',
  styleUrl: './actuaciones.component.css'
})
export class ActuacionesComponent {
  displayedColumns: string[] = ['id', 'descripcion', 'fechaActuacion', 'expediente', 'habilitado'];
  dataSource = new MatTableDataSource<Actuaciones>([]);
  private readonly token: string = localStorage.getItem('token') || environment.token
  public dashboardService = inject( DashboardService )
  public loading: boolean = true;

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  ngOnInit() {
    this.getTipoExpedientes();
    this.hideSpinner();
  }

  hideSpinner() {
    this.loading = true; // Comienza con el spinner visible
    setTimeout(() => this.loading = false, 2000); // Espera la duración de la animación
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  async getTipoExpedientes() {
    try {
      const response = await fetch(environment.actuacionesGet, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.token}`
        }
      });

      if (!response.ok) {
        throw new Error('Respuesta de red no fue ok');
      }

      const respuesta = await response.json();
      console.log(respuesta);
      const datosConvertidos: Actuaciones[] = respuesta.map((item: RespuestaActuaciones) => {
        const fecha = new Date(item.fechaActuacion);
        const fechaLegible = fecha.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        return {
            id: item.id,
            descripcion: item.descripcion,
            fechaActuacion: fechaLegible,
            expediente: item.numeroExpediente,
            habilitado: item.borrado
        };
      });
      this.dataSource.data = datosConvertidos;
    } catch (error) {
      console.error('Hubo un problema con la petición Fetch:', error);
    }
  }
}
