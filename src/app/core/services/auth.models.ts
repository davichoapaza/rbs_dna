export interface Rol {
  id: number;
  codigo: string;
}

export interface UsuarioBackend {
  id: number;
  username: string;
  nombreCompleto: string;
  roles: Rol[];
  token: string;
  refreshToken: string;
  tokenType: string;
}

export interface AuthResponse {
  exito: boolean;
  mensaje: string;
  datos: UsuarioBackend;
}
