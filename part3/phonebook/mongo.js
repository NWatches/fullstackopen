const mongoose = require('mongoose')

// if no password given, ask for it
if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

// get password
const password = process.argv[2]

const url =
  `mongodb+srv://thenemr:${password}@cluster0.njqo8f0.mongodb.net/?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)
mongoose.connect(url)

// set MongoDB schema
const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

// define Person object according to MongoDB Schema
const Person = mongoose.model('Person', personSchema)

// return all names and numbers if only password entered
if (process.argv.length < 4) {
    Person.find({}).then(people => {
      people.forEach(person => {
        console.log('name: ', person.name, 'number: ', person.number)
      });
        mongoose.connection.close()
    });
} else {
// create new Person object using first two arguments given after password
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  })

  // save result to person
  person.save().then(result => {
    console.log(`added ${person.name} number ${person.number} to phonebook`)
    mongoose.connection.close()
  }) 
}

