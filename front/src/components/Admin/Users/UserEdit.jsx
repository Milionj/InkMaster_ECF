import { Edit, SimpleForm, TextInput, SelectInput  } from "react-admin";

export const UserEdit = (props) => (
    <Edit {...props}>

    <SimpleForm>
      <TextInput source="nom" />
      <TextInput source="prenom" />
      <TextInput source="email" />
      <SelectInput source="role" choices={[
        { id: 'admin', name: 'Admin' },
        { id: 'artiste', name: 'Artiste' }
      ]} />
    </SimpleForm>
    
    </Edit>
)