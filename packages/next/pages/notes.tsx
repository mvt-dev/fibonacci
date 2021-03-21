import Head from 'next/head';
import axios from 'axios';
import { AccountController } from '@fibonacci/services';

const uploadFile = async (event) => {
  if (!event.target.files?.length) return;
  const formData = new FormData();
  Array.from(event.target.files).forEach((file) => {
    // formData.append(event.target.name, file);
  });
  const response = await axios.post('/api/note', formData, {
    headers: { 'content-type': 'multipart/form-data' },
    onUploadProgress: (event) => {
      console.log(`Current progress:`, Math.round((event.loaded * 100) / event.total));
    },
  });
};

const Notes = ({ accounts }) => {
  return (
    <div>
      <Head>
        <title>Notas de Corretagem</title>
      </Head>
      <h1>Notas de Corretagem</h1>
      <form>
        <input type="file" onChange={uploadFile} />
      </form>
      {accounts.map(account => (
        <>
          <div>{account.id}</div>
          <div>{account.name}</div>
          <div>{account.type}</div>
        </>
      ))}
    </div>
  );
};

export async function getServerSideProps() {
  const accountControler = new AccountController();
  const accounts = await accountControler.list();
  return { props: { accounts } };
}

export default Notes;
