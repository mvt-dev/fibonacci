import React from 'react';
import Head from 'next/head';
import NextLink from 'next/link';
import { Typography, IconButton, Box, Breadcrumbs, Chip } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import AddIcon from '@material-ui/icons/Add';
import Layout from '../../components/Layout';
import Table from '../../components/Table';
import useService from '../../hooks/useService';
import { list } from '../../services/categoryService';
import { CategoryInterface } from '@fibonacci/interfaces';

const Categories = () => {
  const { data: categories, loading, error } = useService(list());

  const columns = [
    {
      name: 'color',
      header: 'Cor',
      cell: (row) => <Chip size="small" label={row.color} style={{ background: row.color }} />
    },
    {
      name: 'name',
      header: 'Categoria'
    },
    {
      name: 'tag',
      header: 'Tag',
      cell: (row) => {
        switch (row.tag) {
          case CategoryInterface.CategoryTag.Debit: return 'Débito';
          case CategoryInterface.CategoryTag.Credit: return 'Crédito';
          case CategoryInterface.CategoryTag.Virtual: return 'Virtual';
          default: return '-';
        }
      }
    },
    {
      name: 'action',
      header: '',
      cell: (row) => (
        <NextLink href={`/category/${row.id}`}>
          <IconButton color="primary" size="small"><EditIcon fontSize="small" /></IconButton>
        </NextLink>
      ),
      align: 'right'
    },
  ];

  return (
    <Layout>
      <Head>
        <title>Categorias</title>
      </Head>
      <Box mb={3}>
        <Breadcrumbs>
          <Typography color="primary">Categorias</Typography>
        </Breadcrumbs>
      </Box>
      <Table columns={columns} data={categories} loading={loading} error={error}>
        <NextLink href="/category/new">
          <IconButton color="primary"><AddIcon /></IconButton>
        </NextLink>
      </Table>
    </Layout>
  );
};

export default Categories;
