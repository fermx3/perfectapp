import { useState, useRef } from 'react';
import Button, { BUTTON_TYPE_CLASSES } from '../button';
import Loader from '../ui/loader';
import Image from 'next/image';

import classes from './upload-image-form.module.scss';
import { setVisitaActual } from '@/store/visitaActual/visitaActual.reducer';
import { useDispatch } from 'react-redux';

export default function UploadImage({
  section,
  userId,
  lealId,
  visitaActual,
  field,
  setIsModalOpen,
}) {
  const inputFileRef = useRef(null);
  const [blob, setBlob] = useState(null);
  const [isSending, setIsSending] = useState(false);

  const dispatch = useDispatch();

  return (
    <>
      <h3>Sube tu imagen</h3>
      <form
        onSubmit={async (event) => {
          event.preventDefault();
          setIsSending(true);

          const year = new Date().getFullYear();
          const month = new Date().getMonth() + 1;

          const file = inputFileRef.current.files[0];
          const fileName = lealId
            ? `${section}/${year}/${month}/${userId}/${lealId}/${field}/${file.name}`
            : `${section}/${year}/${month}/${userId}/${field}/${file.name}`;

          const response = await fetch(
            `/api/images/upload?filename=${fileName}`,
            {
              method: 'POST',
              body: file,
            }
          );

          const newBlob = await response.json();

          setBlob(newBlob);

          const newArray = visitaActual[field]
            ? [...visitaActual[field], newBlob.url]
            : [newBlob.url];

          dispatch(setVisitaActual({ ...visitaActual, [field]: newArray }));
          setIsSending(false);
        }}
        className={classes.form}
      >
        <input
          name='file'
          ref={inputFileRef}
          type='file'
          accept='image/png, image/jpeg'
          required
        />
        <Button
          type='submit'
          buttonType={
            isSending ? BUTTON_TYPE_CLASSES.disabled : BUTTON_TYPE_CLASSES.base
          }
        >
          Subir
        </Button>
        {isSending && <Loader />}
      </form>
      {blob && (
        <div>
          <div className={classes.imageContainer}>
            <div className={classes.image}>
              <Image
                src={blob.url}
                alt='Uploaded image'
                width={200}
                height={200}
              />
            </div>
            <div className={classes.button}>
              <Button
                buttonType={BUTTON_TYPE_CLASSES.secondary}
                type='button'
                onClick={() => {
                  setBlob(null);
                  inputFileRef.current.value = '';
                }}
              >
                <Image
                  src='/images/icons/camera.svg'
                  alt='Añadir evidencia'
                  width={20}
                  height={20}
                />
                Subir otra imagen
              </Button>
            </div>
            <div className={classes.button}>
              <Button
                buttonType={BUTTON_TYPE_CLASSES.secondary}
                type='button'
                onClick={() => {
                  setIsModalOpen(false);
                }}
              >
                Cerrar
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
