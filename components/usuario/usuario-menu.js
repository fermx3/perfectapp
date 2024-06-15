const options = [
  {
    name: 'Resumen',
    link: `/${role.toLowerCase()}/${userId}`,
  },
  {
    name: 'Base de datos',
    link: `/${role.toLowerCase()}/${userId}/base-de-datos`,
  },
  {
    name: 'Ver PowerBI',
    link: '#',
  },
];

export default function UsuarioMenu({ role, userId }) {
  return <ButtonGroup options={options} />;
}
