import { List, Datagrid, TextField, EmailField, EditButton, DeleteButton, } from 'react-admin'

export const UserList = (props) => (
    <List {...props} >
      <Datagrid>
      <TextField source="id_utilisateur" label="ID" />
      <TextField source="nom" />
      <TextField source="prenom" />
      <EmailField source="email" />
      <TextField source="role" />
      <EditButton />
      <DeleteButton />
      </Datagrid>
    </List>
);
