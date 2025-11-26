import { DataTypes } from 'sequelize';
import sequelize from '../dbSequelize.js';

const User = sequelize.define(
  'User',
  {
    id_utilisateur: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nom: {
      type: DataTypes.STRING(120),
      allowNull: false,
    },
    prenom: {
      type: DataTypes.STRING(120),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    mdp: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('admin', 'artiste', 'employe'),
      allowNull: false,
    },
  },
  {
    tableName: 'utilisateur',
    timestamps: false,
  }
);

export default User;
