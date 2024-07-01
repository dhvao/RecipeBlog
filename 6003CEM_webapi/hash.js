const bcrypt = require('bcrypt');

const plainPassword = 'password'; // The plain text password

bcrypt.hash(plainPassword, 10, (err, hashedPassword) => {
  if (err) {
    console.error('Error hashing password:', err);
    return;
  }
  console.log("Hashed password:", hashedPassword);
});
