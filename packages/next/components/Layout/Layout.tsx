import React from 'react';
import NextLink from 'next/link';
import {
  Container,
  List,
  ListItem,
  ListItemText,
} from '@material-ui/core';
import Snackbar from '../Snackbar';
import useStyles from './Layout.style';


const Layout = (props: React.PropsWithChildren<any>): React.ReactElement => {
  const { children } = props;
  const classes = useStyles();

  return (
    <section>
      <Snackbar />
      <nav>
        <List className={classes.listBox}>
          <NextLink href="/account">
            <ListItem button>
              <ListItemText primary="Contas" />
            </ListItem>
          </NextLink>
          <NextLink href="/category">
            <ListItem button>
              <ListItemText primary="Categorias" />
            </ListItem>
          </NextLink>
        </List>
      </nav>
      <main className={classes.container}>
        <Container maxWidth="lg">
          { children }
        </Container>
      </main>
    </section>
  );
};

export default Layout;
