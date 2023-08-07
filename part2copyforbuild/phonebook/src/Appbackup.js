import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')


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
  
    setPersons(persons.concat(personObject))
    setNewName('')
    setNewNumber('')
  }
  }

  const peopleToShow = persons.filter(person => person.name.toLowerCase().includes(newFilter))

  const handleFilter = (event) => {
    setNewFilter(event.target.value)
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }



  return (
    <div>
      <h2>Phonebook</h2>
        <input value={newFilter} onChange={handleFilter}/>
      <h2>add a new</h2>
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
        <div>debug: {newName}</div>
      </form>
      <h2>Numbers</h2>
      <ul>
        {peopleToShow.map(person =>
          <p key={person.id + 1}>{person.name} {person.number}</p>
          )}
      </ul>
    </div>
  )
}

export default App