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
import { useEffect, useState } from 'react';
import api1 from './apis/api1';
import { toast } from 'react-hot-toast';

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
}

export enum NotificationStatus {
  notStart = 'notStart',
  processing = 'processing',
  done = 'done',
}

export function UsersTable({ users }: { users: User[] }) {
  const [btns, setBtns] = useState({} as any);
  const notify = (user: User) => toast((t) => (<span>Document for <b>{user.username}</b> is generating.Please wait for minutes...
    <button onClick={() => toast.dismiss(t.id)}>✖</button></span>),
    { icon: '💬', duration: Infinity });

  const checkDoc = async (uuid: string) => {
    const resp = await api1.get(`docs/check?subscription-key=${import.meta.env.VITE_API_1_SUBSCRIPTION_KEY}&uuid=${uuid}`);
    if (resp.data?.status === NotificationStatus.done) {
      getDoc(uuid);
      return;
    }

    if (resp.data?.status === NotificationStatus.notStart) {
      await generateDoc(uuid);
      return;
    }
  }

  const getDoc = (uuid: string) => {
    setTimeout(() => {
      api1.get(`docs?subscription-key=${import.meta.env.VITE_API_1_SUBSCRIPTION_KEY}&uuid=${uuid}`, { responseType: 'blob' })
        .then(response => { console.log(response); return response.data; })
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
        .finally(() => updateStatusBtns([uuid], btns, false));
    }, 2000);
  }

  const generateDoc = async (uuid: string) => {
    console.log("generating...");
    const resp = await api1.get(`docs/generate?subscription-key=${import.meta.env.VITE_API_1_SUBSCRIPTION_KEY}&uuid=${uuid}`);
    const user = users.find(u => u.id === uuid);
    notify(user as User);
    updateStatusBtns([uuid], btns, false);
    return resp.data;
  }

  useEffect(() => {
    const obj = {} as any;
    users.forEach(user => obj[user.id] = false);
    setBtns(obj);
  }, [users]);

  const updateStatusBtns = (uuids: string[], btns: any, status: boolean) => {
    const obj = Object.assign({}, btns);
    uuids.forEach(uuid => obj[uuid] = status);
    setBtns(obj);
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
                <Button onClick={() => { updateStatusBtns([user.id], btns, true); checkDoc(user.id) }} loading={btns[user.id]}>Download</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
