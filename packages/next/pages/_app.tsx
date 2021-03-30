import React from 'react';
import Head from 'next/head';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { useRouter } from 'next/router';
import { wrapper } from '../store';

const theme = createMuiTheme({
  palette: {}
});

const MyApp = ({ Component, pageProps }) => {
  const router = useRouter();

  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
    router.replace('/account');
  }, []);

  return (
    <React.Fragment>
      <Head>
        <title>Fibonacci</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Component {...pageProps} />
      </ThemeProvider>
    </React.Fragment>
  );
}

export default wrapper.withRedux(MyApp);
