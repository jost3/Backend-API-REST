import type {Request, Response, NextFunction } from 'express';
import Usuario from '../models/usuario.js';
import fs from 'fs/promises';
import bcrypt from 'bcryptjs';
import path from 'path';


export const getUsuarios = async (req: Request, res: Response) => {

    const usuarios = await Usuario.findAll({
        attributes: { exclude: ['password'] }
    });

    res.json({
        msg: 'Get Usuarios',
        usuarios
    }); 

}

export const getUsuario = async (req: Request, res: Response) => {

    const { id } = req.params;

    if (!id || Array.isArray(id)) {
        return res.status(400).json({
            msg: 'ID de usuario no válido'
        });
    }

    const usuario = await Usuario.findByPk(id, {
        attributes: { exclude: ['password'] }
    });

    res.json({
        msg: 'Get Usuario',
        usuario
    });
};

export const PostUsuarios = async (req: Request, res: Response, next: NextFunction):Promise<void> => {

    try {

        const {body} = req;

        const {nombre, email, password} = body;

        if (!nombre || !email || !password) {
            res.status(400).json({message: 'Lo campos nombre, email y password son obligatorios'});
            return;
        }

        const ExisteEmail = await Usuario.findOne({where: {email: email}});

        if (ExisteEmail) {
            if(req.file){
                await fs.unlink(path.resolve(req.file.path));
            }
            res.status(400).json({message: 'El email ya esta registrado'});
            return;
        }

        if(req.file){
            body.imagen = req.file.filename;

        }else{

            body.imagen = null;
        }

        const salt = bcrypt.genSaltSync(10);
        body.password = bcrypt.hashSync(password, salt);

        const usuario = Usuario.build(body);
        await usuario.save();

        const {password: _, ...usuarioSinPassword} = usuario.toJSON();
        res.status(201).json({
            msg: 'Post Usuarios',
            usuario: usuarioSinPassword
        });


    }catch (error) {
        next(error);
    }
};

export const PuttUsuarios = (req: Request, res: Response) => {

    const {id} = req.params;
    const {body} = req.body;;

    res.json({

        msg: 'Put Usuarios',
        id, 
        body
    });
}


export const DeleteUsuarios = (req: Request, res: Response) => {

    const {id} = req.params;

    res.json({

        msg: 'Delete Usuarios',
    });

}