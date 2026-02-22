import type { PropsWithChildren } from 'react';
import { Box } from '@mui/material';
import { Navbar } from './navbar';

export function Layout({ children }: PropsWithChildren) {
  return (
    <Box>
      <Navbar />
      {children}
    </Box>
  );
}
