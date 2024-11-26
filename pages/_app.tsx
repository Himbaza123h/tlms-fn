import '../styles/globals.scss';
import type { AppProps } from "next/app";
import AuthProvider from "../components/Authprovider/Authprovider";

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}


export default MyApp;