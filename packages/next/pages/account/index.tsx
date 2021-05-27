import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Head from 'next/head';
import NextLink from 'next/link';
import {Typography, IconButton, Box, Breadcrumbs} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import AddIcon from '@material-ui/icons/Add';
import Layout from '../../components/Layout';
import Table from '../../components/Table';
import { AccountType } from '../../interfaces/AccountInterface';
import { fetchAccounts } from '../../store/actions/accounts';
import numeric from '../../libs/numeric';

const Accounts = () => {
  const dispatch = useDispatch();
  dispatch(fetchAccounts());
  const { records: accounts, status, error } = useSelector((state: any) => state.accounts);

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
      name: 'balance',
      header: 'Saldo',
      cell: (row) => <Typography variant="body2" color={row.balance < 0 ? 'secondary' : 'primary'}>{numeric.currency(row.balance)}</Typography>,
      align: 'right'
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
      <Table columns={columns} data={accounts} loading={status === 'loading'} error={error}>
        <NextLink href="/account/new">
          <IconButton color="primary"><AddIcon /></IconButton>
        </NextLink>
      </Table>
    </Layout>
  );
};

export default Accounts;
