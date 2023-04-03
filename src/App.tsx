import { HubConnection } from '@microsoft/signalr/dist/esm/HubConnection';
import { HubConnectionBuilder } from '@microsoft/signalr/dist/esm/HubConnectionBuilder';
import { Button, Callout, Card, TextInput } from '@tremor/react';
import { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import api1 from './apis/api1';
import './App.css';
import { UsersTable } from './table';
import { toast } from 'react-hot-toast';
import { HttpTransportType } from '@microsoft/signalr';
import axios from 'axios';


function App() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [connection, setConnection] = useState<null | HubConnection>(null);
  
  useEffect(() => {
    getUsers();
    connectSignalR();
  }, []);

  useEffect(() => {
    if (connection) {
      connection
        .start()
        .then(() => {
          connection.on(`generatedDocument`, (message) => {
            console.log(message);
            const uuid = message;
            toast.success(() => (
              <span>Generated! Click 
                <b>
                  <a href={`${import.meta.env.VITE_API_1_ENDPOINT}/docs?subscription-key=${import.meta.env.VITE_API_1_SUBSCRIPTION_KEY}&uuid=${uuid}`}> here</a>
                </b> to download document
              </span>), {
              duration: 6000,
            });
          });
        })
        .catch((error) => console.log(error));
    }
  }, [connection]);


  const connectSignalR = async () => {
    const connectionInfo = await axios
      .get(`${import.meta.env.VITE_API_SIGNALR_NEGOTIATE_FUNCTION}`);
    console.log('connectionInfo', connectionInfo);
    
    const connect = new HubConnectionBuilder()
      .withUrl(connectionInfo.data.url, {
        accessTokenFactory: () => connectionInfo.data.accessToken,
        skipNegotiation: true,
        transport: HttpTransportType.WebSockets,
        })
      .withAutomaticReconnect()
      .build();

    console.log('SignalR connection: ', connect);
    setConnection(connect);
  }

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
        <Toaster position="top-right"/>
        <br />
        <Card>
          <form className='form' onSubmit={(e) => { e.preventDefault(); add()}} >
            <TextInput placeholder='Name' onChange={(event) => setName(event.target.value)} />
            <TextInput placeholder='User Name' onChange={(event) => setUsername(event.target.value)} />
            <TextInput placeholder='Email' onChange={(event) => setEmail(event.target.value)} />
            <br />
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
