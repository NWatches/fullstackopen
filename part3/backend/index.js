const express = require('express')
const morgan = require('morgan');
const cors = require('cors')

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
app.use(morgan('tiny :post-data'))

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
response.json(persons)
})

// get a specific person by ID
app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  })

// get count of people and current date
app.get('/info', (request, response) => {
    const personCount = persons.length
    const countMessage = `Phonebook has info for ${personCount} people`
    const currentDate = new Date();
    const resp = `<p>${countMessage}</p><p>${currentDate}</p>`
    
    response.send(resp)
  })

app.delete('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
})

// Math.random creates large random number for ID
// handle posting new person to server, fails if name/number missing, or number already exists
app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.content) {
      return response.status(400).json({ 
          error: 'content missing' 
      })
  } else if (persons.includes(body.content.number)) {
      return response.status(400).json({
          error: 'number already exists'
      })
  } else {
      const person = {
          content: body.content,
          important: body.important || false,
          id: Math.round(Math.random() * 1000000),
        }
      
        persons = persons.concat(person)
      
        response.json(note)
  }
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})