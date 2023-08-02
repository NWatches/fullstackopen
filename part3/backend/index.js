require('dotenv').config()
const express = require('express')
const morgan = require('morgan');
const cors = require('cors')
const mongoose = require('mongoose')
const Person = require('./models/person')

const app = express()

app.use(express.json())

app.use(express.static('build'))

// enable cross origin resource sharing
app.use(cors())

// morgan is logging middleware, we are logging in tiny configuration and adding a custom
// token 'post-data' to log the payload of POST requests
morgan.token('post-data', (req) => {
    if (req.method === 'POST') {
      return JSON.stringify(req.body);
    }
    return '';
  });

// tiny config + custom ':post-data' token
app.use(morgan('tiny'))
app.use(morgan(':post-data'))

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}

let persons = [
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

// get mainpage
app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

// get json of all persons
app.get('/api/persons', (request, response) => {
  // within Person model use find with empty dict to return all
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

// get a specific person by ID
app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id

    Person.findById(id).then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => {
      console.log(error)
      response.status(400).send({ error: 'malformed id' })
    })
})

// get count of people and current date
app.get('/info', (request, response) => {
    Person.find({}).then(persons => {
      const personCount = persons.length
      const countMessage = `Phonebook has info for ${personCount} people`
      const currentDate = new Date();
      const resp = `<p>${countMessage}</p><p>${currentDate}</p>`

      response.send(resp)
    })
    .catch(error => {
      next(error)
    })
  })

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
      .then(result => {
        response.status(204).end()
      })
      .catch(error => next(error))
})

// check if person already exists in phonebook and if so update new number
app.put('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  const newNumber = request.body.number

  Person.findByIdAndUpdate(id, { number: newNumber }, { new: true })
    .then(updatedPerson => response.json(updatedPerson))
    .catch(error => next(error));
  });

// Math.random creates large random number for ID
// handle posting new person to server, fails if name/number missing, or number already exists
app.post('/api/persons', (request, response, next) => {
  const body = request.body
  const person = new Person({
    name: body.name,
    number: body.number,
  })
    console.log('name',person.name)
    console.log('number', person.number)
    person.save().then(savedPerson => {
      response.json(savedPerson)
    }).catch(error => next(error))
  }
)

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})