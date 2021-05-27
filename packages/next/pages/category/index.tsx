import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Head from 'next/head';
import NextLink from 'next/link';
import { Typography, IconButton, Box, Breadcrumbs, Chip } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import AddIcon from '@material-ui/icons/Add';
import Layout from '../../components/Layout';
import Table from '../../components/Table';
import { CategoryTag } from '../../interfaces/CategoryInterface';
import { fetchCategories } from '../../store/actions/categories';

const Categories = () => {
  const dispatch = useDispatch();
  dispatch(fetchCategories());
  const { records: categories, status, error } = useSelector((state: any) => state.categories);

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
          case CategoryTag.Debit: return 'Débito';
          case CategoryTag.Credit: return 'Crédito';
          case CategoryTag.Virtual: return 'Virtual';
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
      <Table columns={columns} data={categories} loading={status === 'loading'} error={error}>
        <NextLink href="/category/new">
          <IconButton color="primary"><AddIcon /></IconButton>
        </NextLink>
      </Table>
    </Layout>
  );
};

export default Categories;
