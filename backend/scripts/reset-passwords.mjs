import 'dotenv/config';
import bcrypt from 'bcrypt';
import db from '../db.js';

// Liste des utilisateurs: changer le mot de passe
// emails de la table `utilisateur`
const usersToUpdate = [
  {
    email: 'admin@inkmaster.com',
    newPassword: 'Admin@inkmaster2025!',      
  },
  {
    email: 'crusher@inkmaster.com',
    newPassword: 'Artiste@inkmaster2025!!',     
  },
  {
    email: 'jade@inkmaster.com',
    newPassword: 'Artiste@inkmaster2025!',
    
  },
    {
    email: 'webs@inkmaster.com',
    newPassword: 'Artiste@inkmaster2025!',      
  },
  
];

async function main() {
  try {
    for (const user of usersToUpdate) {
      const hash = await bcrypt.hash(user.newPassword, 10);

      const [result] = await db.execute(
        'UPDATE utilisateur SET mdp = ? WHERE email = ?',
        [hash, user.email]
      );

      if (result.affectedRows === 0) {
        console.warn(`⚠️ Aucun utilisateur trouvé pour l'email : ${user.email}`);
      } else {
        console.log(`✅ Mot de passe mis à jour pour ${user.email}`);
        console.log(`   Nouveau mdp en clair (à garder pour toi) : ${user.newPassword}`);
      }
    }

    console.log('🎉 Mise à jour terminée.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Erreur lors de la mise à jour des mots de passe :', err);
    process.exit(1);
  }
}

main();
