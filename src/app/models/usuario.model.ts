export class Usuario {

    constructor(
        public nombre: string,
        public email: string,
        public password: string,
        public img?: string, // despues del primer parametro opcional, los que estan por debajo son opcionales
        public role?: string,
        public google?: boolean,
        public _id?: string
    ) { }
}


