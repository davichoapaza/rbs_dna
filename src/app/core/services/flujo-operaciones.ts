import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CrearBorrador {
  directorUsuarioRolId?: number;
  codigoOrden: string;
  titulo: string;
  // Agrega aquí los campos adicionales que requiera tu endpoint backend
}
/*
{
  "codigoOrden": "ORD-2026-004",
  "titulo": "Inspección Anual de Seguridad Operacional",
  "directorUsuarioRolId": 1
}*/

export interface RespuestaApi<T = any> {
  /*exito: boolean;
  mensaje?: string;
  datos?: T;*/
  id: number;
  codigoOrden: string;
  titulo: string;
  estadoId: number;
  estadoNombre: string;
  directorUsuarioRolId: number;
  directorNombreCompleto: string | null;
  fechaCreacion: string;
  fechaActualizacion: string;
}

@Injectable({
  providedIn: 'root',
})
export class FlujoOperaciones {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/operaciones/flujo/crear-borrador';

  crearBorrador(payload: CrearBorrador): Observable<RespuestaApi> {
    return this.http.post<RespuestaApi>(this.apiUrl, payload);
  }

  // En tu servicio FlujoOperaciones (flujo-operaciones.ts)
  obtenerOrdenesInspeccion(): Observable<any> {
    return this.http.get<any>('http://localhost:8080/api/operaciones/flujo/ordenes-inspeccion');
  }
}
