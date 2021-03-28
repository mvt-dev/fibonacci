import Head from 'next/head';
import NextLink from 'next/link';
import {Typography, Box, Breadcrumbs, Button} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Layout from '../../components/Layout';
import Form from '../../components/Form';
import {Field, FieldTypes} from '../../components/Field';
import {AccountInterface} from '@fibonacci/services';
import useRequest from '../../hooks/useRequest';

interface AccountsProps {
  AccountType: typeof AccountInterface.AccountType;
  id: string;
}

const Account = (props: AccountsProps) => {
  const {AccountType, id} = props;

  const {data: account} = id !== 'new' ? useRequest(`/api/account/${id}`) : {data: null};

  const onSubmit = (data) => {
    console.log(data);
  }

  const classes = makeStyles((theme) => ({
    cancelButton: {
      marginLeft: theme.spacing(2)
    }
  }))();

  return (
    <Layout>
      <Head>
        <title>{account?.name || 'Nova'} - Contas</title>
      </Head>
      <Box mb={3}>
        <Breadcrumbs>
          <NextLink href="/account" replace>Contas</NextLink>
          <Typography color="primary">{account?.name || 'Nova'}</Typography>
        </Breadcrumbs>
      </Box>
      <Form onSubmit={onSubmit}>
        <Box mb={3}>
          <Field
            type={FieldTypes.TEXT}
            name="name"
            value={account?.name}
            label="Nome"
            rules={{required: true}}
          />
        </Box>
        <Box mb={3}>
          <Field
            type={FieldTypes.SELECT}
            name="type"
            value={account?.type}
            label="Tipo de conta"
            rules={{required: true}}
            options={[
              {value: AccountType.Transaction, label: 'Conta Corrente'},
              {value: AccountType.Credit, label: 'Cartão de Crédito'},
              {value: AccountType.Investment, label: 'Investimento'},
            ]}
          />
        </Box>
        <Box display="flex">
          <Button type="submit" variant="contained" color="primary">Confirmar</Button>
          <NextLink href="/account" replace><Button className={classes.cancelButton} variant="outlined" color="primary">Cancelar</Button></NextLink>
        </Box>
      </Form>
    </Layout>
  );
};

export async function getServerSideProps({params}) {
  return {props: {
    AccountType: AccountInterface.AccountType,
    id: params.id
  }};
}

export default Account;
