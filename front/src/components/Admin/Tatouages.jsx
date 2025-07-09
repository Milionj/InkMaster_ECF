import { List, Datagrid, TextField, EditButton, Edit, SimpleForm, TextInput, Create, ImageField, } from "react-admin";

// Liste des tatouage avec aperçu image vers artiste

export const TattooList = (props) => (
<List {...props} title="Tatouages">
    <Datagrid>
      <TextField source="id_tatouage" label="ID" />
      <TextField source="titre" />
      <ImageField source="image" label="Aperçu" />
      <TextField source="description" />
      <TextField source="id_utilisateur" label="ID Artiste" />
      <EditButton />
    </Datagrid>
  </List>
);
// Formulaire d’édition d’un tatouage
export const TattooEdit = (props) => (
  <Edit {...props} title="Modifier un tatouage">
    <SimpleForm>
      <TextInput source="titre" />
      <TextInput source="image" />
      <TextInput source="description" />
      <TextInput source="id_utilisateur" label="ID Artiste" />
    </SimpleForm>
  </Edit>
);

// Formulaire de création d'un tatouage
export const TattooCreate = (props) => (
    <Create {...props} title="Créer un tatouage">
    <SimpleForm>
      <TextInput source="titre" />
      <TextInput source="image" />
      <TextInput source="description" />
      <TextInput source="id_utilisateur" label="ID Artiste" />
    </SimpleForm>
  </Create>
);