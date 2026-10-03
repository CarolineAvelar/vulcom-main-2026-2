import prisma from '../database/client.js'

const controller = {}

controller.login = async function(req, res) {
  const username = req.body?.username ?? ''
  const password = req.body?.password ?? ''

  // DESAFIO: esta concatenação é intencionalmente vulnerável a SQL Injection.
  // Não reutilizar este padrão em código de produção.
  // OWASP Top 10:2025 A05 - Injeção (SQL Injection):
  // entradas concatenadas ao SQL são executadas por $queryRawUnsafe como parte da consulta.

  // OWASP Top 10:2025 A09 - Falhas nos Logs de Segurança e no Sistema de Alertas:
  // a consulta registrada contém as credenciais informadas, incluindo a senha.

  try {
    const users = await prisma.$queryRaw`
      SELECT * FROM "User"
      WHERE username = ${username}
      AND password = ${password}
    `

    if(users.length > 0) {
      return res.send({
        success: true,
        message: `Bem-vindo, ${username}!`,
        flag: 'VULCOM{SQLi_Exploit_Success}',
        // OWASP Top 10:2025 A01 - Falha no Controle de Acesso:
        // SELECT * expõe todos os campos encontrados, inclusive senhas em texto puro (A04).
        result: users
      })
    }

    res.status(401).send({
      success: false,
      message: 'Login falhou!',
      result: users
    })
  }
  catch(error) {
    console.error(error)
    // OWASP Top 10:2025 A10 - Tratamento Inadequado de Condições Excepcionais:
    // a resposta de erro revela a consulta SQL e a estrutura interna da tabela.
    res.status(500).send({
      success: false,
      message: 'Erro no servidor'
    })
  }
}

export default controller