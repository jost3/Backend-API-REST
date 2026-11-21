import express, { type Application } from 'express';
import cors from 'cors';
import userRoutes from '../routes/usuarios.routes.js';

class server{

    private app: Application;
    private port: string;   
    private apiPaths = {
        usuarios: '/api/usuarios'
    }
    constructor(){

        this.app = express();
        this.port = process.env.PORT || '8000';
        //todo el BD
        this.middlewares();
        this.routes();  

    }
    // todo la base datos
    middlewares(){
        this.app.use(cors());
        this.app.use(express.json()); 
        this.app.use(express.static('public'));

    }

    routes(){
        this.app.use(this.apiPaths.usuarios, userRoutes);
    }

    listen(){
        this.app.listen(this.port, () => {
            console.log(`Server running on port ${this.port}`);
        });
    }


}

export default server;