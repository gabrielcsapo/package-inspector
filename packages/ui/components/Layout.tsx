import { Container, Link } from '@mui/material';
import Head from 'next/head';
import NextLink from 'next/link';
import * as React from 'react';

import Navbar from '../components/Navbar';
import styles from './Layout.module.css';

type LayoutProps = React.PropsWithChildren<{
  hero?: React.FC;
}>;

const MAIN_CONTAINER_SX_OPTIONS = {
  py: 8,
  backgroundColor: 'grey.100',
  flexGrow: 1,
};

export const Layout: React.FC<LayoutProps> = ({ hero, children }) => {
  const Hero = hero || null;

  return (
    <>
      <Head>
        <title>Package Inspector</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />

      {Hero && <Hero />}

      <Container sx={MAIN_CONTAINER_SX_OPTIONS} maxWidth={false}>
        {children}
      </Container>

      <footer className={styles.footer}>
        Powered by &nbsp;
        <span>
          <NextLink
            href="https://github.com/es-maintenance/package-inspector"
            passHref={true}
          >
            <Link>es-maintenance@package-inspector</Link>
          </NextLink>
        </span>
      </footer>
    </>
  );
};
