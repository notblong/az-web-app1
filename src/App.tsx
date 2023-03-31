import { Button, Callout, Card, TextInput } from '@tremor/react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import api1 from './apis/api1';
import './App.css';
import { UsersTable } from './table';

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
    api1.post(`users?subscription-key=${import.meta.env.VITE_API_1_SUBSCRIPTION_KEY}`, { name, username, email })
      .then(resp => getUsers())
      .catch(error => console.log(error));
  }

  return (
    <>
      <div className="App">
        <Callout
          className="mt-4"
          title="Notifications"
          color="teal"
        >
          All systems are currently within their default operating ranges.
        </Callout>
        <br />
        <Card>
          <form className='form' onSubmit={(e) => { e.preventDefault(); add()}} >
            <TextInput placeholder='Name' onChange={(event) => setName(event.target.value)} />
            <TextInput placeholder='User Name' onChange={(event) => setUsername(event.target.value)} />
            <TextInput placeholder='Email' onChange={(event) => setEmail(event.target.value)}/>
            <Button type="submit">
              Submit
            </Button>
            <Button onClick={(e) => { e.preventDefault(); getUsers(); }}>
              Refresh data
            </Button>
          </form>
        </Card>
        <br />
        <Card>
          <UsersTable users={users} />
        </Card>
      </div>
    </>
  )
}

export default App
