import {Usuario} from './usuario.ts'

declare global{
    namespace Express{
        interface Request{

            usuario?:{
                id:number,
                email:string,
                nombre:string,
                imagen:string | null,
                estado:string | null,
            }
        }
    }
}