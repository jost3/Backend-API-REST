
import { Router } from 'express';
import type { Request, Response, NextFunction, RequestHandler } from 'express';

import {
    getUsuarios,
    PostUsuarios,
    PuttUsuarios,
    DeleteUsuarios,
    getUsuario
} from '../controllers/usuarios.controller.js';
import {upload} from '../middlewares/multerConfig.js';

const router = Router();

const asyncHandler = (fn: RequestHandler): RequestHandler => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

router.get('/', asyncHandler(getUsuarios));
router.get('/:id', asyncHandler(getUsuario));
router.post('/', upload.single('imagen'), asyncHandler(PostUsuarios));
router.put('/:id', asyncHandler(PuttUsuarios));
router.delete('/:id', asyncHandler(DeleteUsuarios));

export default router;
