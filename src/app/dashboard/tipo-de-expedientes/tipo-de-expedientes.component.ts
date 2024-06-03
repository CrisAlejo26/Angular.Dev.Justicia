import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { RespuestaTipoExpedientes, TipoExpedientes } from '../../../interfaces';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environments';
import { DashboardService } from '../dashboard.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-tipo-de-expedientes',
    templateUrl: './tipo-de-expedientes.component.html',
    styleUrl: './tipo-de-expedientes.component.css'
})
export class TipoDeExpedientesComponent {
    displayedColumns: string[] = ['id', 'nombre', 'descripcion', 'habilitado', 'acciones'];
    dataSource = new MatTableDataSource<TipoExpedientes>([]);
    public loading: boolean = true;
    private readonly token: string = localStorage.getItem('token')?.toString() || environment.token;

    @ViewChild(MatPaginator)
    paginator!: MatPaginator;

    constructor(
        private router: Router,
        private dashboardService: DashboardService,
        public dialog: MatDialog,
        private http: HttpClient,
        private snackBar: MatSnackBar
    ) {}

    ngOnInit() {
        this.getTipoExpedientes();
        this.hideSpinner();
    }

    hideSpinner() {
        this.loading = true;
        setTimeout(() => (this.loading = false), 2000);
    }

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
    }

    applyFilter(event: Event): void {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    async getTipoExpedientes() {
        try {
            const response = await fetch(environment.tipoExpedientesGet, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${this.token}`
                }
            });

            if (!response.ok) {
                throw new Error('Respuesta de red no fue ok');
            }

            const respuesta = await response.json();
            const datosConvertidos: TipoExpedientes[] = respuesta.map(
                (item: RespuestaTipoExpedientes) => {
                    return {
                        id: item.id,
                        nombre: item.nombreTipo,
                        descripcion: item.descripcion,
                        habilitado: item.borrado
                    };
                }
            );
            this.dataSource.data = datosConvertidos;
        } catch (error) {
            console.error('Hubo un problema con la petición Fetch:', error);
        }
    }

    editarElemento(tipoExpediente: TipoExpedientes) {
        this.dashboardService.changeData(tipoExpediente);
        this.router.navigate(['/dashboard/formulario-tipoExpedientes', tipoExpediente.id]);
    }

    openConfirmDialog(id: number): void {
        const dialogRef = this.dialog.open(ConfirmDialogComponent);

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.deleteTipoExpediente(id);
                this.snackBar.open('Eliminado con éxito', 'Cerrar', {
                    duration: 3000 // Duración del Snackbar en milisegundos
                });
            } else {
                // El usuario canceló la operación
                console.log('Operación cancelada');
            }
        });
    }

    deleteTipoExpediente(id: number): void {
        const url = environment.tipoExpedientesDelete + id;
        this.http
            .delete(url, {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${this.token}` // Si se requiere autenticación
                })
            })
            .subscribe(
                response => {
                    this.getTipoExpedientes();
                },
                error => {
                    console.error('Error al eliminar el expediente', error);
                    // Manejo de errores
                }
            );
    }
}
