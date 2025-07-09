import {
    List, Datagrid, TextField, EmailField, Edit, SimpleForm, TextInput, Create, EditButton,} from "react-admin";

    //affichage de la liste des utilisateurs (ici : artiste)
export const UserList = (props) => (
    <List {...props} title = "List des artistes">

        <Datagrid>
            <TextField  soucre= "id_utilisateur" label="ID"/>
            <TextField  soucre="nom"/>
            <TextField  soucre="prenom"/>
            <TextField  soucre="email"/>
            <TextField  soucre="role"/>
            <EditButton/>{/* Bouton pour accéder à la page d'édition */}
        </Datagrid>
    </List>
);

//Formulaire d'édition d'un utilisateur
export const UserEdit = (props) => (
     <Edit {...props} title="Modifier un artiste">
    <SimpleForm>
      <TextInput source="nom" />
      <TextInput source="prenom" />
      <TextInput source="email" />
      <TextInput source="role" /> {/* "artiste" ou "admin" */}
    </SimpleForm>
  </Edit>
);

//Formulaire de création  d'un utilisateur
export const UserCreate = (props) => (
    <Create {...props} title="Créer un artiste">
    <SimpleForm>
      <TextInput source="nom" />
      <TextInput source="prenom" />
      <TextInput source="email" />
      <TextInput source="role" defaultValue="artiste" />
    </SimpleForm>
  </Create>
);