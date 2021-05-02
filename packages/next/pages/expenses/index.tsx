import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Head from 'next/head';
import { Typography, Box, Breadcrumbs } from '@material-ui/core';
import Layout from '../../components/Layout';
import Table from '../../components/Table';
import numeric from '../../libs/numeric';
import { fetchExpenses } from '../../store/actions/expenses';
import moment from 'moment';

const Expenses = () => {
  const dispatch = useDispatch();
  dispatch(fetchExpenses());
  const { records: expenses, status, error } = useSelector((state: any) => state.expenses);

  const columns = [
    {
      name: 'category',
      header: 'Categoria'
    },
    {
      name: 'm2',
      header: moment().subtract(2, 'month').format('MMM'),
      align: 'right',
      cell: row => `R$ ${numeric.currency(Math.abs(row.m2))}`,
      total: () => `R$ ${numeric.currency(expenses.reduce((acc, cur) => acc += Math.abs(cur.m2), 0))}`,
      sort: (order, a, b) => order === 'asc' ? a.m2 - b.m2 : b.m2 - a.m2
    },
    {
      name: 'm1',
      header: moment().subtract(1, 'month').format('MMM'),
      align: 'right',
      cell: row => `R$ ${numeric.currency(Math.abs(row.m1))}`,
      total: () => `R$ ${numeric.currency(expenses.reduce((acc, cur) => acc += Math.abs(cur.m1), 0))}`,
      sort: (order, a, b) => order === 'asc' ? a.m1 - b.m1 : b.m1 - a.m1
    },
    {
      name: 'm0',
      header: moment().format('MMM'),
      align: 'right',
      cell: row => `R$ ${numeric.currency(Math.abs(row.m0))}`,
      total: () => `R$ ${numeric.currency(expenses.reduce((acc, cur) => acc += Math.abs(cur.m0), 0))}`,
      sort: (order, a, b) => order === 'asc' ? a.m0 - b.m0 : b.m0 - a.m0
    }
  ];

  return (
    <Layout>
      <Head>
        <title>Gastos</title>
      </Head>
      <Box mb={3}>
        <Breadcrumbs>
          <Typography color="primary">Gastos</Typography>
        </Breadcrumbs>
      </Box>
      <Table columns={columns} data={expenses} loading={status === 'loading'} error={error} showSearch={false} showTotal={true} />
    </Layout>
  );
};

export default Expenses;
