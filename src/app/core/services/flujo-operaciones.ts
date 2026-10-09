import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CrearBorrador {
  directorUsuarioRolId?: number;
  codigoOrden: string;
  titulo: string;
  // Agrega aquí los campos adicionales que requiera tu endpoint backend
}

export interface InstruirYDerivar {
  ordenId: number;
  usuarioRolId: number;
  destinatariosUsuarioRolIds: number[];
  observaciones: string;
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
export interface OrdenInspeccionDto {
  id: number;
  especialidad: string;
  codigoOrden: string;
  nombre: string;
  fechaAsignacion: string;
}

export interface ApiResponse<T> {
  exito: boolean;
  mensaje: string;
  datos: T;
}
@Injectable({
  providedIn: 'root',
})
export class FlujoOperaciones {
  private http = inject(HttpClient);
  private apiUrl = 'http://192.168.25.17:8080/api/operaciones/flujo/crear-borrador';

  crearBorrador(crearBorrador: CrearBorrador): Observable<RespuestaApi> {
    return this.http.post<RespuestaApi>(this.apiUrl, crearBorrador);
  }

  obtenerOrdenesInspeccion(): Observable<any> {
    return this.http.get<any>('http://192.168.25.17:8080/api/operaciones/flujo/ordenes-inspeccion');
  }

  obtenerOrdenesInspeccionJefe(
    usuarioId: number,
    rolId: number,
  ): Observable<ApiResponse<OrdenInspeccionDto[]>> {
    return this.http.get<ApiResponse<OrdenInspeccionDto[]>>(
      `http://localhost:8080/api/operaciones/flujojefe/ordenes-inspeccion/${usuarioId}/${rolId}`,
    );
  }

  //http://localhost:8080/api/operaciones/flujo/instruir-y-derivar

  instruirYDerivar(instruirYDerivar: InstruirYDerivar): Observable<any> {
    return this.http.post<any>(
      'http://192.168.25.17:8080/api/operaciones/flujo/instruir-y-derivar',
      instruirYDerivar,
    );
  }

  obtenerRolYUsuario(rolId: number, especialidadId: number, areaId: number): Observable<any> {
    return this.http.get<any>(
      `http://192.168.25.17:8080/api/v1/seguridad/usuarios/rol/${rolId}/especialidad/${especialidadId}/area/${areaId} `,
    );
  }

  private readonly baseUrl = 'http://localhost:8080/api/operaciones/flujojefe/ordenes-inspeccion';
}
