import { DataTypes } from 'sequelize';
import sequelize from '../dbSequelize.js';

const Tatouage = sequelize.define(
  'Tatouage',
  {
    id_tatouage: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    titre: {
      type: DataTypes.STRING(120),
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    id_utilisateur: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: 'tatouage',
    timestamps: false,
  }
);

export default Tatouage;
