import { useState } from 'react'

const Filter = ({persons, newFilter, setNewFilter}) => {
    const handleFilter = (event) => {
      setNewFilter(event.target.value)
    }
  
    return (
      <div>
          <input value={newFilter} onChange={handleFilter}/>
      </div>
    )
  }



export default Filter
