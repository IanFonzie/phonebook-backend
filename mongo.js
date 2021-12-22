const mongoose = require('mongoose')

if (process.argv.length !== 3 && process.argv.length !== 5) {
  console.log('Please use one of the expected formats: node mongo.js <password> ' + 
              'or node mongo.js <password> <name> <number>')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://fullstack:${password}@cluster0.rehdx.mongodb.net/phonebookApp?retryWrites=true&w=majority`

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
  console.log('phonebook:')
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person)
    })
    mongoose.connection.close()
  })
} else {
  const name = process.argv[3]
  const number = process.argv[4]
  const person = new Person({name, number})

  person.save().then(result => {
    console.log(`Added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
  })
}