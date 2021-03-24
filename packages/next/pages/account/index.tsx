import Head from 'next/head';
import { Typography } from '@material-ui/core';
import Layout from '../../components/Layout';

const Accounts = () => {
  return (
    <Layout>
      <Head>
        <title>Contas</title>
      </Head>
      <Typography variant="h6" color="primary">Contas</Typography>
    </Layout>
  );
};

export default Accounts;
