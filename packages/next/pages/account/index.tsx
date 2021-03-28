import React from 'react';
import Head from 'next/head';
import NextLink from 'next/link';
import {Typography, IconButton, Box, Breadcrumbs} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import AddIcon from '@material-ui/icons/Add';
import Layout from '../../components/Layout';
import Table from '../../components/Table';
import {AccountInterface} from '@fibonacci/services';
import useRequest from '../../hooks/useRequest';

interface AccountsProps {
  AccountType: typeof AccountInterface.AccountType;
}

const Accounts = (props: AccountsProps) => {
  const {AccountType} = props;

  const {data: accounts} = useRequest('/api/account');

  const columns = [
    {
      name: 'name',
      header: 'Conta'
    },
    {
      name: 'type',
      header: 'Tipo de conta',
      cell: (row) => {
        switch (row.type) {
          case AccountType.Transaction: return 'Conta Corrente';
          case AccountType.Credit: return 'Cartão de Crédito';
          case AccountType.Investment: return 'Investimento';
          default: return '-';
        }
      }
    },
    {
      name: 'action',
      header: '',
      cell: (row) => (
        <NextLink href={`/account/${row.id}`}>
          <IconButton color="primary" size="small"><EditIcon fontSize="small" /></IconButton>
        </NextLink>
      ),
      align: 'right'
    },
  ];

  return (
    <Layout>
      <Head>
        <title>Contas</title>
      </Head>
      <Box mb={3}>
        <Breadcrumbs>
          <Typography color="primary">Contas</Typography>
        </Breadcrumbs>
      </Box>
      {accounts && (
        <Table columns={columns} data={accounts}>
          <NextLink href="/account/new">
            <IconButton color="primary"><AddIcon /></IconButton>
          </NextLink>
        </Table>
      )}
    </Layout>
  );
};

export async function getServerSideProps() {
  return {props: {
    AccountType: AccountInterface.AccountType,
  }};
}

export default Accounts;
