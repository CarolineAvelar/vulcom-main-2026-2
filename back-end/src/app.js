import dotenv from 'dotenv'

dotenv.config() // Carrega as variáveis de ambiente do arquivo .env

import express, { json, urlencoded } from 'express'

import cookieParser from 'cookie-parser'

import logger from 'morgan'

const app = express()

import cors from 'cors'

app.use(cors({
 origin: process.env.ALLOWED_ORIGINS.split(','),
 credentials: true
}))


app.use(logger('dev'))

app.use(json())

app.use(urlencoded({ extended: false }))

app.use(cookieParser())

// Cookie de exemplo para demonstração, acessível pelo JavaScript do navegador.
app.use((req, res, next) => {
 res.cookie('cookie-js', 'Cookie acessível via JavaScript', {
   secure: true,
   httpOnly: false
 })
 next()
})

/***** MIDDLEWARE DE AUTENTICAÇÃO ******/

import auth from './middleware/auth.js'
app.use(auth)


/*********** ROTAS DA API **************/

import carsRouter from './routes/cars.js'
app.use('/cars', carsRouter)

import customersRouter from './routes/customers.js'
app.use('/customers', customersRouter)

import usersRouter from './routes/users.js'
app.use('/users', usersRouter)


import xssRouter from './routes/xss.js'
app.use('/challenges/xss', xssRouter)

import sqliRouter from './routes/sqli.js'
app.use('/challenges/sqli', sqliRouter)

export default app