import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UsuarioService } from '../usuario/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class VerficaTokenGuard implements CanActivate {

    constructor( public _ususarioService: UsuarioService,
                public router: Router
    ) {}

    canActivate():  Promise<boolean> | boolean {

        // console.log('inicio verifica');

        const token = this._ususarioService.token;
        const payload = JSON.parse( atob( token.split('.')[1] ));

        const expirado = this.expirado(payload.exp);

        if (expirado ) {
            this.router.navigate(['/login']);
            return false;
        }

        return this.verificaRenueva(payload.exp);
    }


    expirado(fecha_expiracion: number) {
            const ahora = new Date().getTime() / 1000;

            if (fecha_expiracion < ahora) {
                return true;
            } else {
                return false;
            }
    }

    verificaRenueva( fecha_expiracion: number): Promise<boolean> {
        return new Promise ((resolve, reject) => {
            const tokenExp = new Date ( fecha_expiracion * 1000);
            const ahora = new Date();

            ahora.setTime(ahora.getTime() + (1 * 60 * 60 * 1000) ); // cuando falte una hora actualizaremos el token

            // console.log(tokenExp);
            // console.log(ahora);

            if (tokenExp.getTime() > ahora.getTime()) {
                resolve(true);
            } else {
                this._ususarioService.renuevaToken()
                    .subscribe(
                        () => {
                            resolve(true);
                        },
                        () => {
                            reject(false);
                            this.router.navigate(['/login']);
                        }
                    );
            }

            resolve(true);
        });
    }
}
