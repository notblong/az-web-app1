import {
  Table,
  TableHead,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
  Text,
  Button
} from '@tremor/react';
import { useState } from 'react';
import api1 from './apis/api1';

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
}

export function UsersTable({ users }: { users: User[] }) {
  const [loading, setLoading] = useState(false);

  const getDoc = (uuid: string) => {
    setLoading(true);
    api1.get(`docs?subscription-key=${import.meta.env.VITE_API_1_SUBSCRIPTION_KEY}&uuid=${uuid}`, { responseType: "blob" })
      .then(response => response.data)
      .then((blob) => {
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${uuid}.docx`);
        document.body.appendChild(link);
        link.click();

        // remove
        link.parentNode?.removeChild(link);
        URL.revokeObjectURL(url);
      })
      .catch(error => console.log(error))
      .finally(() => setLoading(false));
  }

  return (
    <>
      <Table>
        <TableHead>
          <TableRow>
            <TableHeaderCell>Name</TableHeaderCell>
            <TableHeaderCell>Username</TableHeaderCell>
            <TableHeaderCell>Email</TableHeaderCell>
            <TableHeaderCell>Document</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user, index) => (
            <TableRow key={index}>
              <TableCell>{user.name}</TableCell>
              <TableCell>
                <Text>{user.username}</Text>
              </TableCell>
              <TableCell>
                <Text>{user.email}</Text>
              </TableCell>
              <TableCell>
                <Button onClick={() => getDoc(user.id)}>Download</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
