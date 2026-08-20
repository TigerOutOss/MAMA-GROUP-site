// Génère le hash à mettre dans la variable d'environnement ADMIN_PASSWORD_HASH
// Usage : node hash-password.js "votre_mot_de_passe"
const bcrypt = require('bcryptjs');

const password = process.argv[2];
if (!password) {
  console.log('Usage : node hash-password.js "votre_mot_de_passe"');
  process.exit(1);
}
console.log('\nAjoutez cette ligne dans vos variables d\'environnement :\n');
console.log('ADMIN_PASSWORD_HASH=' + bcrypt.hashSync(password, 10));
console.log('');
