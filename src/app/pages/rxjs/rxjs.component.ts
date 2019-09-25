import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscriber, Subscription } from 'rxjs';
import { retry, map, filter } from 'rxjs/operators';

@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html',
  styles: []
})
export class RxjsComponent implements OnInit, OnDestroy {

    subscripcion: Subscription;

    constructor() {

        // this.regresaObservable().pipe(
        //     retry(2)
        // );


        this.subscripcion = this.regresaObservable().subscribe(
            numero => console.log('Subs ', numero),
            error => console.error('Error en el Subs: ', error),
            () => console.log(' El observador terminó')
        );
    }



    ngOnInit() {
    }

    ngOnDestroy() {
        console.log('Cambiamos de página');
        this.subscripcion.unsubscribe();
    }

    regresaObservable(): Observable<any> {
        return  new Observable((observer: Subscriber<any>) => {
            let contador = 0;
            const intervalo = setInterval(() => {
                contador += 1;

                const salida = {
                    valor: contador
                };

                observer.next(salida);

                // if ( contador === 3 ) {
                //     clearInterval(intervalo);
                //     observer.complete();
                // }

                // if ( contador === 2) {
                //     // clearInterval(intervalo);
                //     observer.error('Error 401');
                // }
            }, 1000);
        }).pipe(

            map( resp => {
                return resp.valor;
            }),
            filter((valor, index) => { // devuelve true or false
                if ( (valor % 2) === 1 ) {
                    // impar
                    return true;
                } else {
                    // par
                    return false;
                }
            })
        );


    }

}
