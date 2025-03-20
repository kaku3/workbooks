import { auth } from '@/auth/auth';
import { Box, Typography, Container } from '@mui/material';

export default async function HomePage() {
  const session = await auth();

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          ようこそ {session?.user?.name || session?.user?.email}
        </Typography>
        <Typography variant="body1">
          チケット管理システムにログインしました。
        </Typography>
      </Box>
    </Container>
  );
}
