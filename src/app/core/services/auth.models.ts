export interface Rol {
  id: number;
  codigo: string; // ej: 'DIRECTOR', 'JEFE', 'INSPECTOR'
}

export interface UsuarioBackend {
  id: number;
  username: string;
  nombreCompleto: string;
  roles: Rol[]; // <-- La propiedad se llama 'roles', no 'rol'
  token: string;
  refreshToken: string;
  tokenType: string;
}

// Para mantener compatibilidad con el tipo antiguo si lo necesitas:
export type UserRole = string;
