import { Component, Input, OnDestroy } from '@angular/core';
import { TipoExpedientes } from '../../../interfaces';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environments';
import { DashboardService } from '../dashboard.service';

@Component({
    selector: 'app-form-tipo-expedientes',
    templateUrl: './form-tipo-expedientes.component.html',
    styleUrl: './form-tipo-expedientes.component.css'
})
export class FormTipoExpedientesComponent implements OnDestroy {
    private readonly token: string = localStorage.getItem('token') || environment.token;
    public id: number = 0;
    public tipoExpedientes: TipoExpedientes[] = [];
    public myForm: FormGroup = this.fb.group({
        nombreTipo: ['', [Validators.required, Validators.minLength(3)]],
        descripcion: ['', [Validators.required, Validators.minLength(5)]],
        borrado: [false]
    });

    constructor(
        private fb: FormBuilder,
        private http: HttpClient,
        private router: Router,
        private dashboardService: DashboardService
    ) {}
    ngOnInit() {
        this.subscribeToData();
    }

    subscribeToData() {
        this.dashboardService.currentData.subscribe((data: TipoExpedientes) => {
            if (data && this.id === 0) {
                this.myForm.patchValue({
                    nombreTipo: data.nombre,
                    descripcion: data.descripcion,
                    borrado: data.habilitado
                });
                this.id = data.id;
                console.log(data);
            }
        });
    }

    ngOnDestroy() {
        this.resetForm();
        this.id = 0;
        this.dashboardService.clearCurrentData();
    }
    isValidField(field: string): boolean | null {
        return this.myForm.controls[field].errors && this.myForm.controls[field].touched;
    }

    getFieldError(field: string): string | null {
        if (!this.myForm.controls[field]) return null;

        const errors = this.myForm.controls[field].errors || {};
        for (const key of Object.keys(errors)) {
            switch (key) {
                case 'required':
                    return 'Este campo es obligatorio';

                case 'minlength':
                    return `Minimo ${errors['minlength'].requiredLength} caracteres.`;
            }
        }

        return null;
    }

    onSubmit(): void {
        if (this.id === 0 || this.id < 0) {
            this.createTipoExpediente();
        } else {
            this.updateTipoExpediente();
        }
    }
    createTipoExpediente(): void {
        if (this.myForm.invalid) return;
        console.log(this.myForm.value);
        const url = environment.tipoExpedientesPost;
        const body = this.myForm.value; // Los datos de tu formulario

        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.token}`
        });
        console.log(body);
        this.http.post(url, body, { headers: headers }).subscribe(
            data => {
                console.log('Respuesta del servidor:', data);
                this.resetForm();
                this.router.navigate(['/dashboard/tipo-de-expedientes']);
            },
            error => {
                this.resetForm();
                console.error('Hubo un error en la petición:', error);
            }
        );
    }

    updateTipoExpediente(): void {
        if (this.myForm.invalid) return;
        const url = environment.tipoExpedientesPut + this.id;
        const body = this.myForm.value; // Los datos de tu formulario

        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.token}`
        });
        console.log(body);
        this.http.patch(url, body, { headers: headers }).subscribe(
            data => {
                console.log('Respuesta del servidor:', data);
                this.resetForm();
                this.router.navigate(['/dashboard/tipo-de-expedientes']);
            },
            error => {
                this.resetForm();
                console.error('Hubo un error en la petición:', error);
            }
        );
    }

    onCancel(): void {
        this.resetForm();
        this.router.navigate(['/dashboard/tipo-de-expedientes']);
    }

    resetForm() {
        this.myForm.reset({ nombreTipo: '', descripcion: '', borrado: false });
        this.id = 0;
        this.dashboardService.clearCurrentData();
    }
}
