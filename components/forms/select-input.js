export default function SelectInput({
  defaultValue,
  options,
  value,
  onChange,
}) {
  return (
    <select onChange={onChange} value={value}>
      <option value='' disabled>
        {defaultValue}
      </option>
      {options.map((option, index) => (
        <option value={option} key={option}>
          {option}
        </option>
      ))}
    </select>
  );
}
