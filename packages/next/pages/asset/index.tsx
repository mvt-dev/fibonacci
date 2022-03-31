import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Head from 'next/head';
import NextLink from 'next/link';
import {Typography, IconButton, Box, Breadcrumbs} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import AddIcon from '@material-ui/icons/Add';
import MoneyIcon from '@material-ui/icons/AttachMoney';
import Layout from '../../components/Layout';
import Table from '../../components/Table';
import { AssetType } from '../../interfaces/AssetInterface';
import { fetchAssets } from '../../store/actions/assets';
import moment from 'moment';

const Assets = () => {
  const dispatch = useDispatch();
  dispatch(fetchAssets());
  const { records: assets, status, error } = useSelector((state: any) => state.assets);

  const columns = [
    {
      name: 'name',
      header: 'Nome'
    },
    {
      name: 'symbol',
      header: 'Código'
    },
    {
      name: 'type',
      header: 'Tipo',
      cell: (row) => {
        switch (row.type) {
          case AssetType.FixedBR: return 'Renda Fixa';
          case AssetType.StockBR: return 'Ações';
          case AssetType.ReitBR: return 'FII';
          case AssetType.StockUS: return 'Stock';
          case AssetType.Crypto: return 'Criptomoedas';
          case AssetType.Currency: return 'Moeda';
          default: return '-';
        }
      }
    },
    {
      name: 'lastPrice',
      header: 'Último Preço',
      cell: row => row.lastPrice ? moment.utc(row.lastPrice).format('DD/MM/YYYY') : '-'
    },
    {
      name: 'action',
      header: '',
      cell: (row) => (
        <NextLink href={`/asset/${row.id}`}>
          <IconButton color="primary" size="small"><EditIcon fontSize="small" /></IconButton>
        </NextLink>
      ),
      align: 'right'
    },
    {
      name: 'action2',
      header: '',
      cell: (row) => (
        <NextLink href={`/asset/${row.id}/price`}>
          <IconButton color="primary" size="small"><MoneyIcon fontSize="small" /></IconButton>
        </NextLink>
      ),
      align: 'right'
    },
  ];

  return (
    <Layout>
      <Head>
        <title>Cotações</title>
      </Head>
      <Box mb={3}>
        <Breadcrumbs>
          <Typography color="primary">Cotações</Typography>
        </Breadcrumbs>
      </Box>
      <Table columns={columns} data={assets} loading={status === 'loading'} error={error}>
        <NextLink href="/asset/new">
          <IconButton color="primary"><AddIcon /></IconButton>
        </NextLink>
      </Table>
    </Layout>
  );
};

export default Assets;
