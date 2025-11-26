import sequelize from '../dbSequelize.js';
import User from './User.js';
import Tatouage from './Tatouage.js';

// 1 user → plusieurs tatouages
User.hasMany(Tatouage, { foreignKey: 'id_utilisateur' });
Tatouage.belongsTo(User, { foreignKey: 'id_utilisateur' });

export { sequelize, User, Tatouage };
