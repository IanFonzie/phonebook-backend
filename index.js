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

app.get('/api/persons', (req, res, next) => {
  Person.find({}).then(persons => {
    return res.json(persons)
  })
})

app.get('/info', (req, res, next) => {
  Person.find({}).then(persons => {
    const respBody = `<p>Phone book has info for ${persons.length} people.</p>` +
    `<p>${new Date()}</p>`
    res.send(respBody)
  })
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
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(result => {
      res.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (req, res, next) => {
  const person = new Person({
    name: req.body.name,
    number: req.body.number
  })
  person.save()
    .then(result => {
      res.status(201).json(result)
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
  const person = {
    name: req.body.name,
    number: req.body.number
  }

  Person.findByIdAndUpdate(req.params.id, person, { new: true, runValidators: true })
    .then(updatedPerson => {
      if (updatedPerson) {
        res.json(updatedPerson) 
      } else {
        res.status(404).end()
      }
    })
    .catch(error => next(error))
})

const errorHandler = (err, req, res, next) => {
  console.log(err)

  if (err.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  } else if (err.name === 'ValidationError' || err.name === 'MongoServerError') {
    return res.status(400).json({ error: err.message})
  }

  next(err)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
