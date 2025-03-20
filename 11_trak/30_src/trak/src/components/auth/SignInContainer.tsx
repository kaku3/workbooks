'use client';

import { Container, Box, Typography } from '@mui/material';
import SignInForm from './SignInForm';

export default function SignInContainer() {
  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
          サインイン
        </Typography>
        <SignInForm />
      </Box>
    </Container>
  );
}
