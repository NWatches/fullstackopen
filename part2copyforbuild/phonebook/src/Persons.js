import { useState } from 'react'
import phoneService from './services/phonenumbers'

const Persons = ({ persons, newFilter, setNewFilter, setPersons, newMessage, setNewMessage, deleted, setDeleted }) => {

  const peopleToShow = persons.filter(person => person.name?.toLowerCase().includes(newFilter.toLowerCase()));

  return (
    <div>
      <ul>
        {peopleToShow.map(person =>
          <p key={person.id + 1}>{person.name} {person.number} <button onClick={() => 
            phoneService.removePerson(person.id, person)
            .then(() => setPersons(persons.filter(p => p.id != person.id)))
            .catch(error => {
              console.log(error)
              setDeleted(true)
              setNewMessage(`Info on ${person.name} has already been removed from`)
            })
          }>delete</button></p> 
          )}
      </ul>
    </div>
  )
}

export default Persons