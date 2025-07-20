import bcrypt from 'bcrypt';

const hashPassword = async (plainPassword) => {
  const hash = await bcrypt.hash(plainPassword, 10);
  console.log(`Hash pour "${plainPassword}" : ${hash}`);
};

hashPassword('motdepasse123');
