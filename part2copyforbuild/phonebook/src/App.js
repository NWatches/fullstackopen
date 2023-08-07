import { useState, useEffect } from 'react'
import Filter from './Filter'
import PersonForm from './PersonForm'
import Persons from './Persons'
import axios from 'axios'
import phoneService from './services/phonenumbers'
import Notification from './Notification'


const App = () => {
  /*const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ])*/
  const [persons, setPersons] = useState([])
  useEffect(() => {
    /*axios.get("http://localhost:3001/persons").then(response => {
      setPersons(response.data)*/
    phoneService
      .getAll()
      .then(initialPhone => {
        setPersons(initialPhone)
      })
  }, [])

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')
  const [newMessage, setNewMessage] = useState(null)
  const [deleted, setDeleted] = useState(false)
  const [errorFlag, setErrorFlag] = useState(false)

  const addPerson = (event) => {
    event.preventDefault()
    if (persons.some(e => e.name == newName)) {
      alert(`${newName} is already added to phonebook`)
    } else {
    const personObject = {
      name: newName,
      number: newNumber,
      id: persons.length + 1,
    }
    /*
    setPersons(persons.concat(personObject))
    setNewName('')
    setNewNumber('')
    
    axios
      .post("http://localhost:3001/persons", personObject)
      .then(response => {
        console.log(reponse)
        setPersons(persons.concat(response.data))
        setNewName('')
        setNewNumber('')
      })*/
    
  }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification newMessage={newMessage} setNewMessage={setNewMessage} deleted={deleted} setDeleted={setDeleted} errorFlag={errorFlag}/>
      <Filter persons={persons} newFilter={newFilter} setNewFilter={setNewFilter}/>
      <h2>add a new</h2>
      <PersonForm persons={persons} setPersons={setPersons} newName={newName} setNewName={setNewName}
      newNumber={newNumber} setNewNumber={setNewNumber} newMessage={newMessage} setNewMessage={setNewMessage}
      deleted={deleted} setDeleted={setDeleted} errorFlag={errorFlag} setErrorFlag={setErrorFlag}
      />
      <h2>Numbers</h2>
      <Persons persons={persons} newFilter={newFilter} setNewFilter={setNewFilter} setPersons={setPersons} newMessage={newMessage}
      setNewMessage={setNewMessage} deleted={deleted} setDeleted={setDeleted}/>
    </div>
  )
}

export default App