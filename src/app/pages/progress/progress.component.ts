import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styles: []
})
export class ProgressComponent implements OnInit {

    progreso1: number = 30;
    progreso2: number = 50;

    constructor() { }

    ngOnInit() {
    }

    // actualizarProgress( event: number) {
    //     console.log('Evento: ', event);
    //     this.progreso1 = event;
    // }

    // cambiarValor(valor) {
    //     if (this.progreso >= 100 && valor > 0) {
    //         this.progreso = 100;
    //         return;
    //     }

    //     if (this.progreso <= 0 && valor < 0) {
    //         this.progreso = 0;
    //         return;
    //     }

    //     this.progreso = this.progreso + valor;
    //     console.log(this.progreso);
    // }

}
