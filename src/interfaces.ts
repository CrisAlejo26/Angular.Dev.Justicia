export interface SidevarItems {
  label: string;
  icon: string;
  url: string;
}

export interface TextOptions {
  x: number;
  y: number;
  size: number;
}

export interface TipoExpedientes {
  id: number;
  nombre: string;
  descripcion: string;
  habilitado: boolean;
}

export interface Expedientes {
  id: number;
  numeroExpediente: number;
  estadoActual: string;
  tipoExpediente: string;
  habilitado: boolean;
  fechaInicio: string;
}
export interface Documentos {
  id: number;
  fecha: string;
  nombre: string;
  actuacion: string;
  documento: string;
  habilitado: boolean;
}
export interface Actuaciones {
  id: number;
  descripcion: string;
  fechaActuacion: string;
  expediente: string;
  habilitado: boolean;
}

// Respuestas de SQL

export interface RespuestaTipoExpedientes {
  borrado: boolean;
  id: number;
  nombreTipo: string;
  descripcion: string;
}

export interface RespuestaActuaciones {
  borrado: boolean;
  id: number;
  fechaActuacion: string;
  descripcion: string;
  numeroExpediente: string;
}

export interface RespuestaDocumentos {
  borrado: boolean;
  id: number;
  fechaCreacion: string;
  nombre: string;
  descripcionActuacion: number;
  contenidoBlob: Blob
}

export interface RespuestaExpedientes {
  borrado: boolean;
  id: number;
  estado: string;
  fechaInicio: string;
  numeroExpediente: string;
  tipoExpediente: string;
  nombreExpediente: string;
  fechaFinalizacion: string;
}
