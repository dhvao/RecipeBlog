const bcrypt = require('bcrypt');

const plainPassword = 'password'; // The plain text password
const hashedPassword = '$2b$10$diuRcy9s/OFYI13PObUt8.OcKrOtPidWuzzsNARteQac4GiLeegnq'; // The new hashed password from the database

bcrypt.compare(plainPassword, hashedPassword, (err, result) => {
  if (err) {
    console.error('Error comparing passwords:', err);
  } else {
    console.log('Password match:', result); // This should log 'true' if the passwords match
  }
});
