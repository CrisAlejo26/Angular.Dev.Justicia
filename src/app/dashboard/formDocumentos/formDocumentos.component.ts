import { Component, OnDestroy } from '@angular/core';
import { Actuaciones, Documentos, RespuestaActuaciones, TextOptions } from '../../../interfaces';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../../environments/environments';
import { formatearFecha } from '../../../helpers/formatearFechaBackend';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { Router } from '@angular/router';
import { DashboardService } from '../dashboard.service';

@Component({
    selector: 'app-form',
    templateUrl: './formDocumentos.component.html',
    styleUrl: './formDocumentos.component.css'
})
export class FormDocumentosComponent implements OnDestroy {
    private readonly token: string = localStorage.getItem('token') || environment.token;
    public actuaciones: Actuaciones[] = [];
    public id: number = 0;
    public myForm: FormGroup = this.fb.group({
        nombre: ['', [Validators.required, Validators.minLength(3)]],
        fechaActuacion: ['', [Validators.required]],
        borrado: [false],
        actuacion: ['', [Validators.required]]
    });

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private dashboardService: DashboardService
    ) {}
    ngOnInit() {
        this.getActuaciones().then(() => {
            this.subscribeToData();
        });
    }

    ngOnDestroy() {
        this.resetForm();
        this.id = 0;
        this.dashboardService.clearCurrentData();
    }

    subscribeToData() {
        this.dashboardService.currentData.subscribe((data: Documentos) => {
            if (data && this.id === 0) {
                const dateParts = data.fecha.split('/'); // Dividir la fecha en partes
                const year = parseInt(dateParts[2], 10); // Año
                const month = parseInt(dateParts[1], 10) - 1; // Mes (los meses en JavaScript comienzan en 0)
                const day = parseInt(dateParts[0], 10); // Día

                const fechaActuacion = new Date(year, month, day); // Crear objeto Date

                this.myForm.patchValue({
                    nombre: data.nombre,
                    fechaActuacion: fechaActuacion, // Usar el objeto Date aquí
                    borrado: data.habilitado === null ? false : data.habilitado
                });

                const actuacionSeleccionada = this.actuaciones.find(
                    act => act.descripcion === data.actuacion
                );

                if (actuacionSeleccionada) {
                    this.myForm.patchValue({
                        actuacion: actuacionSeleccionada.id
                    });
                }
                this.id = data.id;
            }
        });
    }

    onCancel(): void {
        this.resetForm();
        this.router.navigate(['/dashboard/documentos']);
    }

    isValidField(field: string) {
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
    async getActuaciones() {
        try {
            const response = await fetch(environment.actuacionesGet, {
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
            const datosConvertidos: Actuaciones[] = respuesta.map((item: RespuestaActuaciones) => {
                return {
                    id: item.id,
                    descripcion: item.descripcion,
                    fechaActuacion: item.fechaActuacion,
                    habilitado: item.borrado === null ? false : item.borrado
                };
            });
            this.actuaciones = datosConvertidos;
        } catch (error) {
            console.error('Hubo un problema con la petición Fetch:', error);
        }
    }

    async onSave(): Promise<void> {
        if (this.myForm.invalid) return;

        try {
            // Leer y modificar el PDF
            const arrayBuffer = await this.leerPDF();
            const pdfModificado = await this.modificarPDF(arrayBuffer);
            // Formatear la fecha para enviar
            const fecha: string = formatearFecha(this.myForm.value.fechaActuacion);

            // Envía el PDF modificado al servidor
            if (this.id === 0) {
                await this.onCreateDocumento(pdfModificado, fecha);
            } else {
                await this.onUpdateDocumento(pdfModificado, fecha);
            }
        } catch (error) {
            console.error('Error al manejar el PDF:', error);
        }
    }

    async leerPDF(): Promise<ArrayBuffer> {
        const response = await fetch('assets/expediente.pdf');
        const arrayBuffer = await response.arrayBuffer();
        return arrayBuffer;
    }

    async modificarPDF(arrayBuffer: ArrayBuffer): Promise<Blob> {
        const existingPdfDoc = await PDFDocument.load(arrayBuffer);

        // Eliminar las páginas existentes
        const pageCount = existingPdfDoc.getPageCount();
        for (let i = 0; i < pageCount; i++) {
            existingPdfDoc.removePage(0); // Elimina la primera página
        }

        // Configuraciones iniciales
        let page = existingPdfDoc.addPage();
        let y = page.getHeight() - 30; // Ajusta este valor según sea necesario
        const x = 50;
        const maxWidth = page.getWidth() - 2 * x;
        const fontSize = 12;
        const lineHeight = fontSize + 2;

        // Incrustar fuente Helvetica
        const helveticaFont = await existingPdfDoc.embedFont(StandardFonts.Helvetica);

        // Función para dividir el texto en líneas más cortas
        function getLines(paragraph: string) {
            const words = paragraph.split(' ');
            const lines = [];
            let currentLine = words[0];
            for (let i = 1; i < words.length; i++) {
                const word = words[i];
                const width = helveticaFont.widthOfTextAtSize(`${currentLine} ${word}`, fontSize);
                if (width < maxWidth) {
                    currentLine += ` ${word}`;
                } else {
                    lines.push(currentLine);
                    currentLine = word;
                }
            }
            lines.push(currentLine);
            return lines;
        }
        const fechaString = this.myForm.value.fechaActuacion;
        const fechaObj = new Date(fechaString);

        // Formatear la fecha
        const fechaFormateada = fechaObj.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        const actuacionSeleccionada = this.actuaciones.find(act => {
            return act.id === Number(this.myForm.value.actuacion);
        });
        const descripcionActuacion = actuacionSeleccionada
            ? actuacionSeleccionada.descripcion
            : 'No seleccionado';
        // Agregar el texto al PDF
        const text: string[] = [
            `Nombre: ${this.myForm.value.nombre}`,
            `Actuación: ${descripcionActuacion}`,
            `Fecha: ${fechaFormateada}`,
            '',
            'El 25 de marzo de 2024, en la ciudad de San Francisco, se descubrió el cuerpo de Juan Pérez, un exitoso empresario de 45 años. La policía fue alertada por un vecino que había notado movimientos sospechosos en la casa de Pérez durante la noche.',
            '',
            'La investigación inicial reveló que Pérez había sido apuñalado varias veces en el pecho y en el abdomen. Se encontraron huellas dactilares en el lugar del crimen que coinciden con las de un sospechoso conocido por la policía, pero que no ha sido detenido.',
            '',
            'La policía está trabajando en estrecha colaboración con el FBI para rastrear a Rodríguez y recopilar pruebas adicionales. Se espera que Rodríguez sea detenido pronto y se le enfrente por el asesinato de Pérez.',
            '',
            'En conclusión, este caso de asesinato en San Francisco es un ejemplo de cómo la colaboración entre diferentes agencias de seguridad puede llevar a la resolución de crímenes graves. La detención de Rodríguez es un paso importante hacia la justicia para la familia de Pérez y la comunidad.'
        ];
        text.forEach(paragraph => {
            const lines = getLines(paragraph);
            lines.forEach(line => {
                if (y < fontSize) {
                    page = existingPdfDoc.addPage();
                    y = page.getHeight() - 30;
                }
                page.drawText(line, {
                    font: helveticaFont,
                    x: x,
                    y: y,
                    size: fontSize,
                    color: rgb(0, 0, 0)
                });
                y -= lineHeight;
            });
        });

        // Guardar el documento modificado como un Blob
        const pdfBytes = await existingPdfDoc.save();
        return new Blob([pdfBytes], { type: 'application/pdf' });
    }

    async onCreateDocumento(pdfBlob: Blob, fecha: string) {
        const formData: FormData = new FormData();
        formData.append('contenidoBlob', pdfBlob, `${this.myForm.value.nombre}-${fecha}.pdf`);
        formData.append('nombre', this.myForm.value.nombre);
        formData.append('actuacionId', this.myForm.value.actuacion);
        formData.append('fechaCreacion', fecha);
        formData.append('borrado', this.myForm.value.borrado.toString());
        try {
            const response = await fetch(environment.documentosPost, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${this.token}`
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error('Respuesta de red no fue ok');
            }
            this.router.navigate(['/dashboard/documentos']);
        } catch (error) {
            console.error('Hubo un problema con la petición Fetch:', error);
        }
    }

    async onUpdateDocumento(pdfBlob: Blob, fecha: string) {
        const formData: FormData = new FormData();
        formData.append('contenidoBlob', pdfBlob, `${this.myForm.value.nombre}-${fecha}.pdf`);
        formData.append('nombre', this.myForm.value.nombre);
        formData.append('actuacionId', this.myForm.value.actuacion);
        formData.append('fechaCreacion', fecha);
        formData.append('borrado', this.myForm.value.borrado.toString());
        try {
            const response = await fetch(environment.documentosPut + this.id, {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${this.token}`
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error('Respuesta de red no fue ok');
            }
            this.resetForm();
            this.router.navigate(['/dashboard/documentos']);
        } catch (error) {
            console.error('Hubo un problema con la petición Fetch:', error);
        }
    }

    resetForm() {
        this.myForm.reset({ nombre: '', fechaActuacion: '', borrado: false, actuacion: '' });
        this.id = 0;
        this.dashboardService.clearCurrentData();
    }
}
