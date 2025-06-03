import FiltersContextProvider from "@/context/FiltersContext";
import UserContextProvider from "@/context/UserContext";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import React from "react";
import { Toaster } from "react-hot-toast";

export default function App({ Component, pageProps }: AppProps) {
  // @ts-ignore
  const Layout = Component.Layout ? Component.Layout : React.Fragment;

  return (
    <FiltersContextProvider>
      <UserContextProvider>
        <Toaster position="top-center" />
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </UserContextProvider>
    </FiltersContextProvider>
  );
}
