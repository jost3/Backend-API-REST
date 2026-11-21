export const nombre = 'Josue';
console.log(nombre);
import dotenv from 'dotenv';
import Server from './models/server.js';
dotenv.config();

export const server = new Server();

server.listen();