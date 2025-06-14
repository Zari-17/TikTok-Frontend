import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <link rel="icon" href="/tik-tok.png" sizes="any" />

      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
