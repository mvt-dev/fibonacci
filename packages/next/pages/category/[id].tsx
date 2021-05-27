import React, { useState } from 'react';
import Head from 'next/head';
import NextLink from 'next/link';
import {useRouter} from 'next/router'
import { useDispatch } from 'react-redux';
import { Typography, Box, Breadcrumbs, Button, LinearProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Layout from '../../components/Layout';
import Form from '../../components/Form';
import { FieldText, FieldColor, FieldSelect } from '../../components/Field';
import useService from '../../hooks/useService';
import { snackbarShowSuccess, snackbarShowError } from '../../store/actions/snackbar';
import DialogAlert from '../../components/DialogAlert';
import { get, create, update, remove } from '../../services/categoryService';
import { CategoryTag } from '../../interfaces/CategoryInterface';
import { fetchCategories } from '../../store/actions/categories';

const Category = () => {
  const [showRemove, setShowRemove] = useState<boolean>(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const { id } = router.query;
  const {data: category, loading} = id !== 'new' ? useService(get, id) : { data: null, loading: false };

  const onSubmit = async (formData) => {
    try {
      if (id !== 'new') {
        await update({id, ...formData});
        dispatch(snackbarShowSuccess('Categoria atualizada com sucesso'));
      } else {
        await create(formData);
        dispatch(snackbarShowSuccess('Categoria criada com sucesso'));
      }
      dispatch(fetchCategories({ force: true }));
      router.back();
    } catch (error) {
      dispatch(snackbarShowError(error?.response?.data?.message || 'Erro interno! Por favor tente novamente.'));
    }
  };

  const onRemove = async () => {
    try {
      await remove(Number(id));
      router.back();
      dispatch(snackbarShowSuccess('Categoria removida com sucesso'));
    } catch (error) {
      dispatch(snackbarShowError(error?.response?.data?.message || 'Erro interno! Por favor tente novamente.'));
    }
  }

  const classes = makeStyles((theme) => ({
    cancelButton: {
      marginLeft: theme.spacing(2)
    }
  }))();

  return (
    <Layout>
      <Head>
        <title>{category?.name || 'Nova'} - Categorias</title>
      </Head>
      <Box mb={3}>
        <Breadcrumbs>
          <NextLink href="/category" replace>Categorias</NextLink>
          <Typography color="primary">{category?.name || 'Nova'}</Typography>
        </Breadcrumbs>
      </Box>
      {loading && (<Box my={3}><LinearProgress /></Box>)}
      <Form onSubmit={onSubmit}>
        <Box mb={3}>
          <FieldText
            name="name"
            value={category?.name}
            label="Nome"
            rules={{required: true}}
          />
        </Box>
        <Box mb={3}>
          <FieldColor
            name="color"
            value={category?.color}
            label="Cor"
            rules={{required: true}}
          />
        </Box>
        <Box mb={3}>
          <FieldSelect
            name="tag"
            value={category?.tag}
            label="Tag"
            rules={{required: true}}
            options={[
              {value: CategoryTag.Debit, label: 'Débito'},
              {value: CategoryTag.Credit, label: 'Crédito'},
              {value: CategoryTag.Virtual, label: 'Virtual'},
            ]}
          />
        </Box>
        <Box display="flex" justifyContent="space-between">
          <Box>
            <Button type="submit" variant="contained" color="primary">Confirmar</Button>
            <NextLink href="/category" replace><Button className={classes.cancelButton} variant="outlined" color="primary">Cancelar</Button></NextLink>
          </Box>
          {id !== 'new' && (
            <Button variant="outlined" color="secondary" onClick={() => setShowRemove(true)}>Remover</Button>
          )}
        </Box>
      </Form>
      <DialogAlert
        title="Remover Categoria"
        description="Confirma a remoção da categoria?"
        open={showRemove}
        close={() => setShowRemove(false)}
        confirm={onRemove}
      />
    </Layout>
  );
};

export default Category;
