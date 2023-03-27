import { Button, Card, TextInput } from '@tremor/react'
import axios from 'axios'
import { useEffect, useState } from 'react'
import './App.css'
import { UsersTable } from './table'
import api1 from './apis/api1'

function App() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const emailRegex = new RegExp('/\S+@\S+\.\S+/');
  
  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = () => {
    api1.get(`users?subscription-key=${import.meta.env.VITE_API_1_SUBSCRIPTION_KEY}`)
      .then(response => setUsers(response.data))
      .catch(error => console.log(error));
  }

  const add = () => {
    axios.post(`users?subscription-key=${import.meta.env.VITE_API_1_SUBSCRIPTION_KEY}`, { name, username, email })
      .then(response => setUsers(response.data))
      .catch(error => console.log(error));
  }

  return (
    <>
      <div className="App">
        <form className='form' onSubmit={(e) => {e.preventDefault(); add()}} >
          <TextInput placeholder='Name' onChange={(event) => setName(event.target.value)} />
          <TextInput placeholder='User Name' onChange={(event) => setUsername(event.target.value)} />
          <TextInput placeholder='Email' onChange={(event) => setEmail(event.target.value)}/>
          <Button type="submit">
            Submit
          </Button>
        </form>
        <Button onClick={getUsers}>
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
