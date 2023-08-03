const mongoose = require('mongoose')


mongoose.set('strictQuery',false)

const url = process.env.MONGODB_URI

console.log('connecting to', url)

// connect to MongoDB
mongoose.connect(url)
  // eslint-disable-next-line no-unused-vars
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

// define schema for person
const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true
  },
  number: {
    type: String,
    minLength: 8,
    required: true,
    validate: {
      validator: function(v) {
        return /^\d{2,3}-\d{5,6}$/.test(v)
      }
    }
  },
  id: String
})

// redefine JSON returned to not include MongoDB's ID and Version
personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

// create Person model according to personSchema
module.exports = mongoose.model('Person', personSchema)