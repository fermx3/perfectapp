import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import ModalBackground from '../modal-background';
import Modal from '../modal';
import Loader from '../loader';

export default function PageLoader() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleStart = (url) => {
      if (
        url === '/' ||
        url === '/#nosotros' ||
        url === '/#soluciones' ||
        url === '/#ayuda'
      ) {
        return;
      }
      setLoading(true);
    };
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
        <Modal transparent>
          <Loader />
          <h1>Cargando...</h1>
        </Modal>
      </ModalBackground>
    );
  }
}
