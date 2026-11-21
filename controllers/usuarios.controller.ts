import type {Request, Response, NextFunction } from 'express';

export const getUsuarios = (req: Request, res: Response) => {

    const {id} = req.params;

    res.json({

        msg: 'get Usuarios',
        id
    });

}

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