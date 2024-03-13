import FormControl from '../forms/form-control';

export default function AssessmentProducto({ fieldsToAdd }) {
  return [...Array(Number(fieldsToAdd))].map((value, index) => (
    <FormControl
      type='select'
      label={`Competidor ${index + 1}`}
      options={['Chipilo', 'Chilchota', 'Lala', 'Otra']}
      key={index}
    />
  ));
}
