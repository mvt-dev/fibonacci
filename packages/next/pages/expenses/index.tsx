import React from 'react';
import Head from 'next/head';
import { Typography, Box, Breadcrumbs } from '@material-ui/core';
import Layout from '../../components/Layout';
import Table from '../../components/Table';
import useService from '../../hooks/useService';
import { list } from '../../services/expensesService';
import numeric from '../../libs/numeric';

const Expenses = () => {
  const { data: expenses, loading, error } = useService(list);

  const columns = [
    {
      name: 'name',
      header: 'Categoria'
    },
    {
      name: 'value',
      header: 'Total',
      align: 'right',
      cell: row => `R$ ${numeric.currency(row.value * -1)}`,
      total: () => `R$ ${numeric.currency(expenses.reduce((acc, cur) => acc += cur.value * -1, 0))}`,
      sort: (order, a, b) => order === 'asc' ? a.value - b.value : b.value - a.value
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
      <Table columns={columns} data={expenses} loading={loading} error={error} showSearch={false} showTotal={true} />
    </Layout>
  );
};

export default Expenses;
