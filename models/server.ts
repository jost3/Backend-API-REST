import express, { type Application } from 'express';
import cors from 'cors';
import userRoutes from '../routes/usuarios.routes.js';
import db from '../database/connection.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
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
        this.app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

        this.app.use((err:any, req:express.Request, res:express.Response, next:express.NextFunction)=> {

            if(err instanceof multer.MulterError){

                res.status(400).json({
                    error: err.message
                });

            }else if(err){
                res.status(500).json({
                    error: err.message
                });
            }else{
                next();
            }

        })

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