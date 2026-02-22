import { Routes, Route, Link } from 'react-router-dom';
import { Button, CircularProgress } from '@mui/material';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PostPage, HomePage, PostsPage, RegisterPage, LoginPage, UsersPage, AdminPanel } from './pages';
import { useIsAuth } from './hooks';

// 5 minutes
const STALE_TIME_MS = 1000 * 60 * 5;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: STALE_TIME_MS,
    },
  },
});

function App() {
  const { isLoading } = useIsAuth();

  if (isLoading) {
    return (
      <CircularProgress
        sx={{ position: 'absolute', top: '50%', left: '50%' }}
        size={100}
        color="secondary"
      />
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div>
        <Routes>
          <Route
            path="/register"
            element={<RegisterPage />}
          />
          <Route
            path="/login"
            element={<LoginPage />}
          />
          <Route
            path="/"
            element={<HomePage />}
          />
          <Route
            path="/posts"
            element={<PostsPage />}
          />
          <Route
            path="/users"
            element={<UsersPage />}
          />
          <Route
            path="/admin"
            element={<AdminPanel />}
          />
          <Route
            path="/posts/:id"
            element={<PostPage />}
          />
          <Route
            path="*"
            element={
              <div>
                <h1>404 Not Found</h1>
                <Button
                  component={Link}
                  to="/"
                >
                  Go to home
                </Button>
              </div>
            }
          />
        </Routes>
      </div>

      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
