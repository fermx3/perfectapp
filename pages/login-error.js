import Container from '@/components/layout/container';
import { getSession } from 'next-auth/react';

export default function LoginErrorPage() {
  return (
    <Container md>
      <h1>Login Error</h1>
    </Container>
  );
}
