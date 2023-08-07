import { useState } from 'react'
import axios from 'axios'
import phoneService from './services/phonenumbers'


const PersonForm = ({persons, newName, newNumber, setPersons, setNewName, setNewNumber, 
  newMessage, setNewMessage, deleted, setDeleted, errorFlag, setErrorFlag}) => {
  const addPerson = (event) => {
    event.preventDefault()
    const personObject = {
      name: newName,
      number: newNumber,
    }
    if (persons.some(e => e.name == newName)) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
      const personIndex = persons.findIndex(person => person.name === newName)
      const personId = persons[personIndex].id

      phoneService
        .update(personId, personObject)
        .then(response => {
          let newPersons = [...persons]
          newPersons[personIndex] = response.data
          setPersons(newPersons)
          setNewName('')
          setNewNumber('')
          setNewMessage(response.data.name)
          setDeleted(false)
          setTimeout(() => {
            setNewMessage(null)
          }, 5000)
        })
      /*axios.put(`http://localhost:3001/persons/${personId}`, personObject)
      .then(response => {
        let newPersons = [...persons]
        newPersons[personIndex] = response.data
        setPersons(newPersons)
        setNewName('')
        setNewNumber('')
      })*/
    }
      setNewName('')
      setNewNumber('')
  } else {
    phoneService
      .create(personObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setNewName('')
        setNewNumber('')
      })
      .catch(error => {
        setErrorFlag(true)
        setNewMessage(error.response.data.error)
        console.log(error.response.data.error)
      })
    }
  }
  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  return (
    <div>
      <form onSubmit={addPerson}>
        <div>
          name: <input value={newName} onChange={handleNameChange}/>
        </div>
        <div>
          number: <input value={newNumber} onChange={handleNumberChange}/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    </div>
  )
}

export default PersonForm