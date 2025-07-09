import { Create, SimpleForm, TextInput, SelectInput } from 'react-admin';

export const UserCreate = (props) => (
    <Create {...props}>
        
      <SimpleForm>
      <TextInput source="nom" />
      <TextInput source="prenom" />
      <TextInput source="email" />
      <TextInput source="password" type="password" />
      <SelectInput source="role" choices={[
        { id: 'admin', name: 'Admin' },
        { id: 'artiste', name: 'Artiste' }
      ]} />
    </SimpleForm>

    </Create>
)