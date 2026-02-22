import { Container, Typography } from '@mui/material';
import { Layout } from '../components';

const MEM_IMAGE = 'https://i.pinimg.com/474x/d5/c2/4c/d5c24c875379a8ec77f71eb001414ddd.jpg';

export function HomePage() {
  return (
    <Layout>
      <Container
        maxWidth="xl"
        sx={{ marginTop: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}
      >
        <Typography variant="h4">Welcome to the home page</Typography>
        <img
          src={MEM_IMAGE}
          alt="mem"
          width={400}
          height={400}
        />
      </Container>
    </Layout>
  );
}
