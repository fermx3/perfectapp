export default function SelectInput({
  defaultValue,
  options,
  value,
  onChange,
  locked,
}) {
  return (
    <select
      onChange={onChange}
      value={value}
      style={
        locked
          ? {
              pointerEvents: 'none',
              opacity: '0',
              position: 'absolute',
              zIndex: '-999',
            }
          : null
      }
    >
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
