import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import NextLink from 'next/link';
import { Typography, IconButton, Box, Breadcrumbs, Chip } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import AddIcon from '@material-ui/icons/Add';
import Layout from '../../components/Layout';
import Table from '../../components/Table';
import { list } from '../../services/transactionService';
import Form from '../../components/Form';
import { FieldDate } from '../../components/Field';
import moment from 'moment';
import { useForm } from 'react-hook-form';
import numeric from '../../libs/numeric';
import { TransactionInterface } from '@fibonacci/interfaces';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [days, setDays] = useState(null);

  const formMethods = useForm({
    defaultValues: {
      'date-from': moment().startOf('month'),
      'date-to': moment(),
    }
  });
  const dateFrom = formMethods.watch('date-from');
  const dateTo = formMethods.watch('date-to');

  const columns = [
    {
      name: 'date',
      header: 'Data',
      cell: (row) => moment.utc(row.date).format('DD/MM')
    },
    {
      name: 'type',
      header: 'Tipo',
      cell: (row) => {
        switch (row.type) {
          case TransactionInterface.TransactionType.Adjustment: return 'Ajuste';
          case TransactionInterface.TransactionType.Buy: return 'Compra';
          case TransactionInterface.TransactionType.Dividend: return 'Dividendo';
          case TransactionInterface.TransactionType.Emolumento: return 'Emolumento';
          case TransactionInterface.TransactionType.Fee: return 'Taxa';
          case TransactionInterface.TransactionType.Investment: return 'Aporte';
          case TransactionInterface.TransactionType.JCP: return 'JCP';
          case TransactionInterface.TransactionType.Profit: return 'Provento';
          case TransactionInterface.TransactionType.Rent: return 'Aluguel';
          case TransactionInterface.TransactionType.Sell: return 'Venda';
          case TransactionInterface.TransactionType.Whithdraw: return 'Retirada';
          default: return '-';
        }
      }
    },
    {
      name: 'description',
      header: 'Descrição'
    },
    {
      name: 'value',
      header: 'Valor',
      cell: (row) => <Typography variant="body2" color={row.value < 0 ? 'secondary' : 'primary'}>{numeric.currency(row.value)}</Typography>,
      align: 'right'
    },
    {
      name: 'action',
      header: '',
      cell: (row) => (
        <NextLink href={`/transaction/${row.id}`}>
          <IconButton color="primary" size="small"><EditIcon fontSize="small" /></IconButton>
        </NextLink>
      ),
      align: 'right'
    },
  ];

  // useEffect(() => {
  //   formMethods.setValue('date-from', moment().startOf('month'));
  //   formMethods.setValue('date-to', moment());
  // }, []);

  useEffect(() => {
    if (dateFrom && dateTo) {
      setDays(dateTo.diff(dateFrom, 'days'));
      setLoading(true);
      setError(null);
      list(dateFrom.format('YYYY-MM-DD'), dateTo.format('YYYY-MM-DD'))
        .then(data => setTransactions(data))
        .catch(error => setError(error))
        .finally(() => setLoading(false));
    }
  }, [dateFrom, dateTo]);

  const setDate = (days: number) => {
    formMethods.setValue('date-from', moment().subtract(days, 'days'));
    formMethods.setValue('date-to', moment());
  }

  return (
    <Layout>
      <Head>
        <title>Extrato</title>
      </Head>
      <Box mb={3}>
        <Breadcrumbs>
          <Typography color="primary">Extrato</Typography>
        </Breadcrumbs>
      </Box>
      <Form useOutside={formMethods} onSubmit={null}>
        <Box mb={2} display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex">
            <Box>
              <FieldDate
                name="date-from"
                value={null}
                label="Data Inicial"
                rules={{required: true}}
              />
            </Box>
            <Box ml={2}>
              <FieldDate
                name="date-to"
                value={null}
                label="Data Final"
                rules={{required: true}}
              />
            </Box>
          </Box>
          <Box display="flex">
            <Box ml={2}>
              <Chip label="7 dias" variant="default" color={days === 7 ? 'primary' : 'default'} onClick={() => setDate(7)} />
            </Box>
            <Box ml={2}>
              <Chip label="15 dias" variant="default" color={days === 15 ? 'primary' : 'default'} onClick={() => setDate(15)} />
            </Box>
            <Box ml={2}>
              <Chip label="30 dias" variant="default" color={days === 30 ? 'primary' : 'default'} onClick={() => setDate(30)} />
            </Box>
          </Box>
        </Box>
      </Form>
      <Table columns={columns} data={transactions} loading={loading} error={error}>
        <NextLink href="/transaction/new">
          <IconButton color="primary"><AddIcon /></IconButton>
        </NextLink>
      </Table>
    </Layout>
  );
};

export default Transactions;
