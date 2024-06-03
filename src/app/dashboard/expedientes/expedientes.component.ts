import { Component, ViewChild } from '@angular/core';
import { Expedientes, RespuestaActuaciones, RespuestaExpedientes } from '../../../interfaces';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { environment } from '../../../environments/environments';

@Component({
  selector: 'app-expedientes',
  templateUrl: './expedientes.component.html',
  styleUrl: './expedientes.component.css'
})
export class ExpedientesComponent {
  displayedColumns: string[] = ['id', 'numeroExpediente', 'estadoActual', 'tipoExpediente', 'habilitado', 'fechaInicio'];
  dataSource = new MatTableDataSource<Expedientes>([]);
  public loading: boolean = true;
  private readonly token: string = localStorage.getItem('token') || environment.token

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit() {
    this.getExpedientes();
    this.hideSpinner();
  }

  hideSpinner() {
    this.loading = true;
    setTimeout(() => this.loading = false, 2000);
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  async getExpedientes() {
    try {
      const response = await fetch(environment.expedientesGet, {
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
      const datosConvertidos: Expedientes[] = respuesta.map((item: RespuestaExpedientes) => {
        const fecha = new Date(item.fechaInicio);
        const fechaLegible = fecha.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        return {
            id: item.id,
            numeroExpediente: item.numeroExpediente,
            estadoActual: item.estado,
            tipoExpediente: item.nombreExpediente,
            habilitado: item.borrado,
            fechaIncio: fechaLegible
        };
      });
      this.dataSource.data = datosConvertidos;
    } catch (error) {
      console.error('Hubo un problema con la petición Fetch:', error);
    }
  }
}
