import Head from 'next/head';
import axios from 'axios';

const uploadFile = async (event) => {
  if (!event.target.files?.length) return;
  const formData = new FormData();
  Array.from(event.target.files).forEach((file) => {
    formData.append(event.target.name, file);
  });
  const response = await axios.post('/api/note', formData, {
    headers: { 'content-type': 'multipart/form-data' },
    onUploadProgress: (event) => {
      console.log(`Current progress:`, Math.round((event.loaded * 100) / event.total));
    },
  });
};

export default function Notes() {
  return (
    <div>
      <Head>
        <title>Notas de Corretagem</title>
      </Head>
      <h1>Notas de Corretagem</h1>
      <form>
        <input type="file" onChange={uploadFile} />
      </form>
    </div>
  );
};
