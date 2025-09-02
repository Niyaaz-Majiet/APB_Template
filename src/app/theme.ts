
'use client';

import { createTheme } from '@mui/material/styles';
import { Roboto } from 'next/font/google';

import { LicenseInfo } from '@mui/x-license';

LicenseInfo.setLicenseKey('your-license-key-here');
// Or, for production, use the environment variable
// LicenseInfo.setLicenseKey(process.env.MUI_PRO_LICENSE_KEY);

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
});

const theme = createTheme({
  typography: {
    fontFamily: roboto.style.fontFamily,
  },
});

export default theme;