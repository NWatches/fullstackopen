const Notification = ({ newMessage, setNewMessage, deleted, setDeleted, errorFlag, setErrorFlag}) => {
    const confirmationStyle = {
        color: 'green',
        fontStyle: 'italic',
        fontSize: 16,
        background: 'lightgrey',
        fontSize: 20,
        borderStyle: 'solid',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10
      }

      const alreadyDeletedStyle = {
        color: 'red',
        fontStyle: 'italic',
        fontSize: 16,
        background: 'lightgrey',
        fontSize: 20,
        borderStyle: 'solid',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10
      }
    if (newMessage === null) {
      return null
    } else if (deleted) {
        return (
          <div style={alreadyDeletedStyle} className='confirmation'>
            Added {newMessage}
          </div>
        )
    } else if (errorFlag) {
        return (
          <div style={alreadyDeletedStyle} className='confirmation'>
            {newMessage}
          </div>
        )
    } else {
    return (
      <div style={confirmationStyle} className='confirmation'>
        Added {newMessage}
      </div>
    )
  }
}
export default Notification