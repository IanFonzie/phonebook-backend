require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()

app.use(cors())
app.use(express.static('build'))
app.use(express.json())

morgan.token('body', (req, res) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

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

app.get('/api/persons', (req, res, next) => {
  Person.find({}).then(persons => {
    return res.json(persons)
  })
})

app.get('/info', (req, res, next) => {
  const body = `<p>Phone book has info for ${persons.length} people.</p>` +
  `<p>${new Date()}</p>`
  res.send(body)
})

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(person)
      } else {
        res.status(404).end()
      }
    })
    .catch(error => {
      console.log(error)
      res.status(400).send({ error: 'malformatted id' })
    })
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(result => {
      res.status(204).end()
    })
    .catch(error => {
      console.log(error)
      res.status(400).send({ error: 'malformatted id' })
    })
})

app.post('/api/persons', (req, res, next) => {
  const body = req.body

  if (!(body.name && body.number)) {
    return res.status(400).json({error: 'name or number missing'})
  }

  Person.find({name: body.name})
    .then(persons => {
      if (persons.length > 0) {
        return res.status(400).json({error: 'name must be unique'})
      }
      const person = new Person({
        name: body.name,
        number: body.number
      })
      person.save().then(result => {
        res.status(201).json(result)
      })
    })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})