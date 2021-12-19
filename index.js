const express = require('express')
const app = express()

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
  return res.json(persons)
})

app.get('/info', (req, res, next) => {
  const body = `<p>Phone book has info for ${persons.length} people.</p>` +
  `<p>${new Date()}</p>`
  res.send(body)
})

app.get('/api/persons/:id', (req, res, next) => {
  const id = Number(req.params.id)
  const person = persons.find(person => person.id === id)
  if (!person) {
    return res.status(404).end()
  }

  res.json(person)
})

app.delete('/api/persons/:id', (req, res, next) => {
  const id = Number(req.params.id)
  persons = persons.filter(person => person.id !== id)
  
  return res.status(204).end()
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})