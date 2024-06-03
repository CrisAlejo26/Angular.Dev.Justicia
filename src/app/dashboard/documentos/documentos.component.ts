import { Component } from '@angular/core';
import { Documentos, RespuestaDocumentos } from '../../../interfaces';
import { environment } from '../../../environments/environments';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
import { Router } from '@angular/router';
import { DashboardService } from '../dashboard.service';

@Component({
  selector: 'app-documentos',
  templateUrl: './documentos.component.html',
  styleUrl: './documentos.component.css'
})
export class DocumentosComponent {
  public documentos: Documentos[] = [];
  private readonly token: string = localStorage.getItem('token') || environment.token
  public filteredDocumentos: Documentos[] = [];
  public searchTerm: string = '';
  public loading: boolean = true;

  constructor(public dialog: MatDialog,
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private router: Router,
    private dashboardService: DashboardService,) { }
  ngOnInit() {
    this.getDocumentos();
    this.hideSpinner();
  }

  hideSpinner() {
    this.loading = true; // Comienza con el spinner visible
    setTimeout(() => this.loading = false, 2000); // Espera la duración de la animación
  }

  async getDocumentos() {
    try {
      const response = await fetch(environment.documentosGet, {
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
      const datosConvertidos: Documentos[] = respuesta.map((item: RespuestaDocumentos) => {
        return {
          id: item.id,
          nombre: item.nombre,
          actuacion: item.descripcionActuacion,
          habilitado: item.borrado === null ? false : item.borrado,
          fecha: new Date(item.fechaCreacion).toLocaleDateString('es-ES'),
          documento: item.contenidoBlob
        };
      });

      this.documentos = datosConvertidos;
      this.filteredDocumentos = this.documentos;
    } catch (error) {
      console.error('Hubo un problema con la petición Fetch:', error);
    }
  }

  async downloadDocumento(documento: Documentos): Promise<void> {
    if (documento && documento.documento) {
        const blob = this.base64ToBlob(documento.documento);
        this.downloadFile(blob, `${documento.id}-${documento.nombre}.pdf`);
    } else {
        console.error('El documento no está disponible para descargar');
    }
  }

  private base64ToBlob(base64: string): Blob {
    // Eliminar prefijo si está presente
    const base64WithoutPrefix = base64.split(',')[1] || base64;

    // Convertir la cadena Base64 a un ArrayBuffer
    const binaryString = window.atob(base64WithoutPrefix);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }

    // Crear el Blob con el ArrayBuffer
    return new Blob([bytes.buffer], { type: 'application/pdf' });
  }

  private downloadFile(blob: Blob, fileName: string) {
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = fileName;
    document.body.appendChild(anchor);
    anchor.click();
    window.URL.revokeObjectURL(url);
    anchor.remove();
  }

  openConfirmDialog(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.deleteDocumento(id);

      } else {
        // El usuario canceló la operación
        console.log('Operación cancelada');
      }
    });
  }

  deleteDocumento(id: number): void {
    const url = environment.documentosDelete + id;
    this.http.delete(url, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}` // Si se requiere autenticación
      }),
      responseType: 'text'
    }).subscribe(
      response => {
        this.getDocumentos();
        this.snackBar.open('Eliminado con éxito', 'Cerrar', { duration: 3000 });
      },
      error => {
        console.error('Error al eliminar el expediente', error);
        // Manejo de errores aquí
      }
    );
  }

  editarElemento(documento: Documentos) {
    this.dashboardService.changeDataDocumentos(documento);
    this.router.navigate(['/dashboard/formulario-documentos', documento.id]);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.searchTerm = filterValue.trim().toLowerCase();

    if (this.searchTerm) {
      this.filteredDocumentos = this.documentos.filter(doc =>
        doc.nombre.toLowerCase().includes(this.searchTerm) ||
        doc.actuacion.toLowerCase().includes(this.searchTerm) ||
        doc.fecha.toLowerCase().includes(this.searchTerm)
      );
    } else {
      this.filteredDocumentos = this.documentos;
    }
  }
}
