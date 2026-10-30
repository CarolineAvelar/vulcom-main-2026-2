import prisma from '../database/client.js'
import sanitizeHtml from 'sanitize-html'

const controller = {}

controller.retrieveComments = async function(req, res) {
  try {
    const comments = await prisma.xssComment.findMany({
      orderBy: { id: 'asc' }
    })

    res.send(comments)
  }
  catch(error) {
    console.error(error)
    res.status(500).end()
  }
}

controller.createComment = async function(req, res) {
  try {
    const content = sanitizeHtml(req.body?.content ?? '', {
      allowedTags: [],
      allowedAttributes: {}
    })

    await prisma.xssComment.create({
      data: { content }
    })

    res.status(201).end()
  }
  catch(error) {
    console.error(error)
    res.status(500).end()
  }
}

export default controller
