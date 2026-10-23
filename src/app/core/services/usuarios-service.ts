/*import { Service } from '@angular/core';

@Service()
export class UsuariosService {}
*/

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsuariosService {
  private http = inject(HttpClient);
  private apiUrl = 'http://192.168.25.17:8080/api/v1/seguridad';

  obtenerPersonal(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/personal/detalle`);
  }

  obtenerUnidades(): Observable<any[]> {
    console.log('Obteniendo unidades desde el servicio...');
    return this.http.get<any[]>(`${this.apiUrl}/unidades`);
  }

  /* obtenerEspecialidades(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/especialidades`);
  }
*/
  obtenerEspecialidadesPorUnidad(unidadId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/especialidades/unidad/${unidadId}`);
  }

  obtenerRoles(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/roles`);
  }

  registrarPersona(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/personas`, data);
  }

  actualizarPersona(id: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/personas/${id}`, data);
  }

  cambiarEstadoUsuario(usuarioId: number, bloqueado: boolean): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/usuarios/${usuarioId}/estado`, { bloqueado });
  }
}
