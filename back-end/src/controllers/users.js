import prisma from '../database/client.js'
import jwt from 'jsonwebtoken'
import argon2 from 'argon2'

const argon2Options = {
  type: argon2.argon2id,
  memoryCost: 65536,
  timeCost: 3,
  parallelism: 4
}

const controller = {}     // Objeto vazio

controller.create = async function(req, res) {
  try {
    const passwordHash = await argon2.hash(
      req.body.password,
      argon2Options
    )

    await prisma.user.create({
      data: {
        ...req.body,
        password: passwordHash
      }
    })

    res.status(201).end()
  }
  catch(error) {
    console.error(error)
    res.status(500).end()
  }
}


controller.retrieveAll = async function(req, res) {
  try {
    const result = await prisma.user.findMany()

    const users = result.map(({ password, ...user }) => user)

    res.send(users)
  }
  catch(error) {
    console.error(error)
    res.status(500).end()
  }
}


controller.retrieveOne = async function(req, res) {
  try {
    const result = await prisma.user.findUnique({
      where: { id: Number(req.params.id) }
    })

    // Encontrou: remove o campo password antes de retornar
    if(result) {
      const { password, ...user } = result
      res.send(user)
    }
    // Não encontrou: retorna HTTP 404
    else {
      res.status(404).end()
    }
  }
  catch(error) {
    console.error(error)

    // HTTP 500: Internal Server Error
    res.status(500).end()
  }
}

controller.update = async function(req, res) {
  try {
    const data = { ...req.body }

    if(data.password) {
      data.password = await argon2.hash(
        data.password,
        argon2Options
      )
    }

    const result = await prisma.user.update({
      where: { id: Number(req.params.id) },
      data
    })

    if(result) res.status(204).end()
    else res.status(404).end()
  }
  catch(error) {
    console.error(error)
    res.status(500).end()
  }
}

controller.delete = async function(req, res) {
  try {
    await prisma.user.delete({
      where: { id: Number(req.params.id) }
    })

    // Encontrou e excluiu ~> HTTP 204: No Content
    res.status(204).end()
  }
  catch(error) {
    if(error?.code === 'P2025') {
      // Não encontrou e não excluiu ~> HTTP 404: Not Found
      res.status(404).end()
    }
    else {
      // Outros tipos de erro
      console.error(error)

      // HTTP 500: Internal Server Error
      res.status(500).end()
    }
  }
}


controller.login = async function(req, res) {
  try {

      // Busca o usuário no BD usando o valor dos campos
      // "username" OU "email"
      const user = await prisma.user.findFirst({
        where: {
          OR: [
            { username: req.body?.username },
            { email: req.body?.email }
          ]
        }
      })

      // Se o usuário não for encontrado, retorna
      // HTTP 401: Unauthorized
      if(! user) return res.status(401).end()

      // Usuário encontrado, conferir a senha.
      // Se já estiver em Argon2id, verifica o hash.
      // Se estiver em texto puro, compara e converte para hash
      // após um login bem-sucedido.
      let passwordIsValid

      if(user.password.startsWith('$argon2id$')) {
        passwordIsValid = await argon2.verify(
          user.password,
          req.body?.password
        )
      }
      else {
        passwordIsValid = user.password === req.body?.password

       
        if(passwordIsValid) {
          const passwordHash = await argon2.hash(
            req.body.password,
            argon2Options
          )

          await prisma.user.update({
            where: { id: user.id },
            data: { password: passwordHash }
          })
        }
      }

      // Se a senha estiver errada, retorna
      // HTTP 401: Unauthorized
      if(! passwordIsValid) return res.status(401).end()

      const { password, ...publicUser } = user

      const token = jwt.sign(
        publicUser,
        process.env.TOKEN_SECRET,
        { expiresIn: '24h' }
      )

      // Formamos o cookie para enviar ao front-end
      res.cookie(process.env.AUTH_COOKIE_NAME, token, {
        httpOnly: true, // O cookie ficará inacessível para o JS no front-end
        secure: true,   // O cookie será criptografado em conexões https
        sameSite: 'None',
        path: '/',
        maxAge: 24 * 60 * 60 * 1000  // 24h
      })

      // Retorna o token e o usuário autenticado sem a senha.
      res.send({ token, user: publicUser })

  }
  catch(error) {
    console.error(error)

    // HTTP 500: Internal Server Error
    res.status(500).end()
  }
}


controller.me = function(req, res) {
  // Retorna as informações do usuário autenticado
  // HTTP 200: OK (implícito)
  res.send(req?.authUser)
}

export default controller