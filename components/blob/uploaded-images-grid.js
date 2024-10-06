import Image from 'next/image';
import FormControl from '../forms/form-control';
import Button, { BUTTON_TYPE_CLASSES } from '../button';

import classes from './uploaded-images-grid.module.scss';
import { useDispatch } from 'react-redux';
import { setVisitaActual } from '@/store/visitaActual/visitaActual.reducer';
import { useState } from 'react';
import Loader from '../ui/loader';

export default function UploadedImagesGrid({ imagenes, visitaActual, field }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const dispatch = useDispatch();

  const handleDeleteImage = async (index) => {
    // Delete the image from the array
    const newArray = imagenes.filter((_, i) => i !== index);

    setIsDeleting(true);

    // Delete the image from the server
    const response = await fetch(`/api/images/delete?url=${imagenes[index]}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      console.error('Error deleting image');
      setIsDeleting(false);
      return;
    } else {
      // Update the state
      dispatch(setVisitaActual({ ...visitaActual, [field]: newArray }));
      setIsDeleting(false);
    }
  };

  return (
    <FormControl>
      <div className={classes.imageContainer}>
        {imagenes.map((evidencia, index) => (
          <div className={classes.image} key={index}>
            <Image src={evidencia} alt={`Imagen subida ${index}`} fill />
            <Button
              buttonType={
                isDeleting
                  ? BUTTON_TYPE_CLASSES.disabled
                  : BUTTON_TYPE_CLASSES.secondary
              }
              type='button'
              onClick={() => handleDeleteImage(index)}
            >
              {isDeleting ? <Loader /> : 'Borrar imagen'}
            </Button>
          </div>
        ))}
      </div>
    </FormControl>
  );
}
