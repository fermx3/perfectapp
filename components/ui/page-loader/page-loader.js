import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import ModalBackground from '../modal-background';
import Modal from '../modal';
import Loader from '../loader';
import Container from '@/components/layout/container';

export default function PageLoader() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleStart = (url) => setLoading(true);
    const handleComplete = (url) => setLoading(false);

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.on('routeChangeStart', handleStart);
      router.events.on('routeChangeComplete', handleComplete);
      router.events.on('routeChangeError', handleComplete);
    };
  }, []);

  if (loading) {
    return (
      <ModalBackground>
        <Modal>
          <Loader />
          <h1>Cargando...</h1>
        </Modal>
      </ModalBackground>
    );
  }
}
