import Image from 'next/image';
import Button, { BUTTON_TYPE_CLASSES } from '../button';
import classes from './image-picker.module.scss';
import { useRef, useState } from 'react';
import Loader from '../ui/loader';

export default function ImagePicker({
  label,
  name,
  index,
  setValue,
  blob,
  setBlob,
}) {
  const imageInputRef = useRef();

  const [isUploading, setIsUploading] = useState(false);
  const [pickedImage, setPickedImage] = useState(null);

  function handlePickClick() {
    imageInputRef.current.click();
  }

  async function handleImageChange(event) {
    const file = event.target.files[0];

    if (!file) {
      setBlob(null);
      setIsUploading(false);
      return;
    }

    setIsUploading(true);
    const fileName = `${name}/${file.name}`;

    const response = await fetch(`/api/images/upload?filename=${fileName}`, {
      method: 'POST',
      body: file,
    });

    const newBlob = await response.json();

    setBlob(newBlob);

    setValue(`bannersLeales[${index}].src`, newBlob.url, {
      shouldTouch: true,
    });

    const fileReader = new FileReader();
    fileReader.onload = function () {
      setPickedImage(fileReader.result);
    };
    fileReader.readAsDataURL(file);

    setIsUploading(false);
  }

  return (
    <div className={classes.picker}>
      <div className={classes.controls}>
        {pickedImage && (
          <div className={classes.imageContainer}>
            <Image src={pickedImage} alt='picked image' fill />
          </div>
        )}
        <input
          className={classes.input}
          type='file'
          id={name}
          accept='image/png, image/jpeg'
          name={name}
          ref={imageInputRef}
          onChange={handleImageChange}
        />
        {isUploading ? (
          <Loader />
        ) : (
          !pickedImage && (
            <Button
              type='button'
              buttonType={BUTTON_TYPE_CLASSES.outline}
              onClick={handlePickClick}
            >
              Selecciona una imagen
            </Button>
          )
        )}
      </div>
      <label htmlFor={name}>{label}</label>
    </div>
  );
}
