import {Router} from 'express';
import { getUsuarios, 
    PostUsuarios, 
    PuttUsuarios, 
    DeleteUsuarios, 
    getUsuario} from '../controllers/usuarios.controller.js';

    const router = Router();

    router.get('/', getUsuarios);
    router.get('/:id', getUsuario);
    router.post('/', PostUsuarios);
    router.put('/:id', PuttUsuarios);
    router.delete('/:id', DeleteUsuarios);

    export default router;
