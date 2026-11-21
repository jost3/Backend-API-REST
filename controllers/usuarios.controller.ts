import type {Request, Response, NextFunction } from 'express';
import Usuario from '../models/usuario.js';

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

export const PostUsuarios = (req: Request, res: Response) => {

    const {body} = req;

    res.json({

        msg: 'Post Usuarios',
        body
    });

}

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