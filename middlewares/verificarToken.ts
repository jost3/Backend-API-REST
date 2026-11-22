import type { Request, Response, NextFunction } from "express";  
import jwt, { type JwtPayload } from 'jsonwebtoken';
import { JWT_SECRET } from "../database/configjwt.js";
import { request } from "node:http";

export const verficarToken = async (req:Request, res: Response, next: NextFunction)=> {
    const authHeader = req.header('Authorization');

    const token = authHeader?.startsWith('Bearer ')
    ? authHeader.slice(7).trim()
    : undefined;

    if (!token) {
        res.status(401).json({message:'No hay token, Autorizacion denegada'})

        return;
    }

    try {

        const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload & {id:number;  email:string;};
        req.usuario = {
            id:decoded.id,
            email:decoded.email,
            nombre:'',
            imagen:null,
            estado:null

        };
        next();
        
    } catch (error) {
        res.status(401).json({message:'token invalido o expirado'})
        
    }
}