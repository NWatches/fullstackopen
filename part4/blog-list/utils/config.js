require('dotenv').config()

const PORT = process.env.PORT
const MONGODB_URI = process.env.MONGODB_URI

module.exports = {
  MONGODB_URI,
  PORT
}

// mongodb+srv://nemrnahle:<password>@cluster0.bdddzdc.mongodb.net/?retryWrites=true&w=majority