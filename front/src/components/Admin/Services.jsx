// src/components/Admin/Services.jsx
import {
  List,
  Datagrid,
  TextField,
  Edit,
  SimpleForm,
  TextInput,
  Create,
  EditButton,
} from "react-admin";

// Liste des services proposés (tatouage, piercing, retrait, etc.)
export const ServiceList = (props) => (
  <List {...props} title="Services proposés">
    <Datagrid>
      <TextField source="id_Service" label="ID" />
      <TextField source="nom" />
      <TextField source="description" />
      <EditButton />
    </Datagrid>
  </List>
);

// Formulaire d’édition d’un service
export const ServiceEdit = (props) => (
  <Edit {...props} title="Modifier un service">
    <SimpleForm>
      <TextInput source="nom" />
      <TextInput source="description" />
    </SimpleForm>
  </Edit>
);

// Formulaire de création d’un service
export const ServiceCreate = (props) => (
  <Create {...props} title="Créer un service">
    <SimpleForm>
      <TextInput source="nom" />
      <TextInput source="description" />
    </SimpleForm>
  </Create>
);
