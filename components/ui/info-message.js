export default function InfoMessage({ titulo, contenido }) {
  return (
    <div>
      <h4>ℹ️ {titulo}</h4>
      <p>{contenido}</p>
    </div>
  );
}
