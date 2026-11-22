import type {Request, Response, NextFunction } from 'express';
import Usuario from '../models/usuario.js';
import fs from 'fs/promises';
import bcrypt from 'bcryptjs';
import path from 'path';
import {Op} from 'sequelize';
import getConnection from '../database/connectionQuery.js';
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../database/configjwt.js';

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

export const PutUsuarios = async (req: Request, res: Response): Promise<void> => {

    const {id} = req.params;
    const body = req.body;;

 try {

        // Validar ID
        if (!id || Array.isArray(id)) {
            res.status(400).json({
                msg: 'ID de usuario no válido'
            });
            return;
        }

        const usuario = await Usuario.findByPk(id);

        if (!usuario) {
            res.status(404).json({
                msg: 'El usuario no existe'
            });
            return;
        }

        const usuarioData = usuario.toJSON();

        if (body.email) {

            const emailExistente = await Usuario.findOne({
                where: {
                    email: body.email,
                    id: {
                        [Op.ne]: id
                    }
                }
            });

            if (emailExistente) {

                if (req.file) {
                    await fs.unlink(path.resolve(req.file.path));
                }

                res.status(400).json({
                    msg: `El email ${body.email} ya está registrado`
                });
                return;
            }
        }

        if (req.file) {
            body.imagen = req.file.filename;
        }

        if (body.password) {
            const salt = bcrypt.genSaltSync(10);
            body.password = bcrypt.hashSync(body.password, salt);
        }

        await usuario.update(body);

        if (req.file && usuarioData.imagen) {
            try {
                await fs.unlink(
                    path.resolve('uploads', usuarioData.imagen)
                );
            } catch (error) {
                console.error('Error al eliminar la imagen anterior:', error);
            }
        }

        const { password: _, ...usuarioSinPassword } = usuario.toJSON();

        res.json({
            msg: 'Usuario actualizado correctamente',
            usuario: usuarioSinPassword
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            msg: 'Error interno del servidor'
        });
    }
};


export const DeleteUsuarios = async (req: Request, res: Response) => {

    const {id} = req.params;

    try {


        const connection = await getConnection();

        const [rowa] = await connection.query('SELECT * FROM usuarios WHERE id = ?', [id]);

        if ((rowa as any).length === 0) {
            return res.status(404).json({message: 'El usuario no existe en la base de datos'});
        }

        const {imagen} = (rowa as any)[0];  
        await fs.unlink(path.resolve(`uploads/${imagen}`));
        console.log('Imagen eliminada del servidor');
        
        await connection.query('DELETE FROM usuarios WHERE id = ?', [id]);
        res.json({message: 'El Usuario eliminado correctamente'});

    }catch (error) {

        console.error(error);
        res.status(500).json({message:'Error interno del servidor'})

    }

}


export const Login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const usuario = await Usuario.findOne({ where: { email } });

       
        if (!usuario) {
            return res.status(400).json({
                message: 'Credenciales incorrectas'
            });
        }

        const usuarioData = usuario.toJSON();

       
        const ValidPassword = await bcrypt.compare(
            password,
            usuarioData.password
        );

        if (!ValidPassword) {
            return res.status(400).json({
                message: 'Credenciales incorrectas'
            });
        }

        
        const token = jwt.sign({
            id: usuarioData.id,
            email: usuarioData.email,
            nombre: usuarioData.nombre,
            imagen: usuarioData.imagen,
            estado: usuarioData.estado
        }, JWT_SECRET, { expiresIn: '24h' });

        return res.json(token);

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: 'Error interno del servidor'
        });
    }
};
