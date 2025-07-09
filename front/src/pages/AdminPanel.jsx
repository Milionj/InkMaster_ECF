import { Admin, Resource } from "react-admin";
import simpleRestProvider from "ra-data-simple-rest";
import { UserList, UserCreate, UserEdit } from "../components/Admin/Users";
import { TattooList, TattooCreate, TattooEdit } from "../components/Admin/Tatouages";
import { ServiceList, ServiceCreate, ServiceEdit } from "../components/Admin/Services";


const dataProvider = simpleRestProvider("http://localhost:3001");

export default function AdminPanel() {
  return (
     <Admin basename="/admin" dataProvider={dataProvider}>
      <Resource name="utilisateurs" list={UserList} create={UserCreate} edit={UserEdit} />
      <Resource name="tatouages" list={TattooList} create={TattooCreate} edit={TattooEdit} />
      <Resource name="services" list={ServiceList} create={ServiceCreate} edit={ServiceEdit} />
    </Admin>
  );
}
