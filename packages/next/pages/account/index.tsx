import React from 'react';
import Head from 'next/head';
import NextLink from 'next/link';
import {Typography, IconButton, Box, Breadcrumbs} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import AddIcon from '@material-ui/icons/Add';
import Layout from '../../components/Layout';
import Table from '../../components/Table';
import { AccountInterface } from '@fibonacci/interfaces';
import useService from '../../hooks/useService';
import { list } from '../../services/accountService';

const Accounts = () => {
  const {data: accounts, loading, error} = useService(list);

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
          case AccountInterface.AccountType.Transaction: return 'Conta Corrente';
          case AccountInterface.AccountType.Credit: return 'Cartão de Crédito';
          case AccountInterface.AccountType.Investment: return 'Investimento';
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
      <Table columns={columns} data={accounts} loading={loading} error={error}>
        <NextLink href="/account/new">
          <IconButton color="primary"><AddIcon /></IconButton>
        </NextLink>
      </Table>
    </Layout>
  );
};

export default Accounts;
