export default function FormSection({ children, titulo }) {
  return (
    <div>
      <h4>{titulo}</h4>
      {children}
    </div>
  );
}
