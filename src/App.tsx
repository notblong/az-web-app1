import { Button, Card, TextInput } from '@tremor/react'
import axios from 'axios'
import { useEffect, useState } from 'react'
import './App.css'
import { UsersTable } from './table'

function App() {1
  const [users, setUsers] = useState([]);
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const emailRegex = new RegExp('/\S+@\S+\.\S+/');
  
  useEffect(() => {
    axios.get('https://pblo-api-app1.azurewebsites.net/users')
      .then(response => {
        setUsers(response.data)
      })
      .catch(error => console.log(error));
  }, []);


  return (
    <>
      <div className="App">
        <TextInput placeholder='Name' onChange={(event) => setName(event.target.value)} />
        <TextInput placeholder='User Name' onChange={(event) => setUsername(event.target.value)} />
        <TextInput placeholder='Email' onChange={(event) => setEmail(event.target.value)}/>
        <Button onClick={() => console.log("clicked")}>
          Submit
        </Button>
        <Button onClick={() => console.log("clicked")}>
          Refresh data
        </Button>
        <Card>
          <UsersTable users={users} />
        </Card>
      </div>
    </>
  )
}

export default App
