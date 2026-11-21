import express, { type Application } from 'express';
import cors from 'cors';
import userRoutes from '../routes/usuarios.routes.js';
import db from '../database/connection.js';

class server{

    private app: Application;
    private port: string;   
    private apiPaths = {
        usuarios: '/api/usuarios'
    }
    constructor(){

        this.app = express();
        this.port = process.env.PORT || '8000';
        this.dbConnection();
        this.middlewares();
        this.routes();  

    }
    // todo la base datos

    async dbConnection(){

        try {
            await db.authenticate();
            console.log('Database online...');
        } catch (error) {
            console.error('Unable to connect to the database:', error);
        }
    }

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