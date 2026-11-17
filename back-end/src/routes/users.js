import { Router } from 'express'
import controller from '../controllers/users.js'

const router = Router()

// OWASP Top 10:2025 A07 - Falhas de Autenticação:
// não há limitação de tentativas nem bloqueio de ataques automatizados ao login.
router.post('/login', controller.login)
router.get('/me', controller.me)
router.post('/logout', controller.logout)


// OWASP Top 10:2025 A01 - Falha no Controle de Acesso:
// o CRUD permite consultar e modificar usuários sem autenticação nem autorização de administrador.
router.post('/', controller.create)
router.get('/', controller.retrieveAll)
router.get('/:id', controller.retrieveOne)
router.put('/:id', controller.update)
router.delete('/:id', controller.delete)


export default router