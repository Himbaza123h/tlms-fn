import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
        <title>TLMS-</title>
          {/* Google Fonts link */}
          <link
            href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap"
            rel="stylesheet"
          />
          {/* Custom body font */}
          <style>{`
          ::-webkit-scrollbar-thumb:hover {
            background: #bcbcbc; /* Darker gray color when hovered */
            }


            /* For WebKit-based browsers */
            ::-webkit-scrollbar {
            width: 6px !important; /* Thin scrollbar */
            }

            ::-webkit-scrollbar-track {
            background: #f0f2f5 !important; /* Gray background for the track */
            border-radius: 7px !important; /* Rounded track */
            }

            ::-webkit-scrollbar-thumb {
            background: rgb(169, 169, 169) !important; /* Gray thumb */
            border-radius: 7px !important; /* Rounded thumb */
            }

            body {
              font-family: 'Montserrat', Arial, Helvetica, sans-serif;
            }
          `}</style>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;