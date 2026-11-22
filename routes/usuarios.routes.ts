
import { Router } from 'express';
import type { Request, Response, NextFunction, RequestHandler } from 'express';

import {
    getUsuarios,
    PostUsuarios,
    PutUsuarios,
    DeleteUsuarios,
    getUsuario,
    Login
} from '../controllers/usuarios.controller.js';
import {upload} from '../middlewares/multerConfig.js';
import { verficarToken } from '../middlewares/verificarToken.js';
const router = Router();

const asyncHandler = (fn: RequestHandler): RequestHandler => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

router.get('/',verficarToken  ,asyncHandler(getUsuarios));
router.get('/:id', verficarToken, asyncHandler(getUsuario));
router.post('/',verficarToken, upload.single('imagen'), asyncHandler(PostUsuarios));
router.put('/:id',verficarToken, upload.single('imagen'), asyncHandler(PutUsuarios));
router.delete('/:id',verficarToken, asyncHandler(DeleteUsuarios));
router.post('/login', asyncHandler(Login));

export default router;
