import '../styles/globals.scss';
import Head from 'next/head';
import type { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ToastContainer } from 'react-toastify'; 
import AuthProvider from '../components/Authprovider/Authprovider';
import 'react-toastify/dist/ReactToastify.css';  

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1, 
      staleTime: 5000, // Consider data fresh for 5 seconds
    },
  },
});

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <>
      <Head>
        <title>TLMS</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Component {...pageProps} />
          <ToastContainer position="top-right" autoClose={5000} />
        </AuthProvider>
      </QueryClientProvider>
    </>
  );
}

export default MyApp;
