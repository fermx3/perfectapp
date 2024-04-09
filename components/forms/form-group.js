export default function FormGroup({ children, titulo }) {
  return (
    <div>
      {titulo && <h4>{titulo}</h4>}
      {children}
    </div>
  );
}
