require('dotenv').config()
const express = require('express')
const morgan = require('morgan');
const app = express()
const Person = require('./build/models/person') 
const mongoose = require('mongoose')

app.use(express.static('build'))
app.use(express.json())

morgan.token('body', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :body"))

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

let notes = [
    { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
    },
    { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
    },
    { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
    },
    { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
    }
]
  
app.get('/info', (request, response) => {
    const d = new Date()
    const resp = `<p>Phonebook has info for ${notes.length} people<p>
    ${d}`
    response.send(resp)
  })

  app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    Person.findById(request.params.id).then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
  })

  app.delete('/api/persons/:id', (request, response) => {
    Note.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
  })

  app.post('/api/persons', (request, response) => {
    const id = Math.random() * 1000
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'name or number missing'
        })
    } else if (notes.some(person => body.name == person.name)) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }

    const person = new Person({
      id: id,
      name: body.name,
      number: body.number
    });

    person.save().then(savedPerson => {
      response.json(savedPerson)
      console.log(savedPerson)
    })
  })


  app.use(unknownEndpoint)

  app.get('/api/notes', (request, response) => {
    Person.find({}).then(people => {
      response.json(people)
    })
  })

  const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    } 
  
    next(error)
  }

  app.use(errorHandler)

  const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })