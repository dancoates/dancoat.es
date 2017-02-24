const bcrypt = require('bcrypt');
const rawPassword = process.argv[2];

bcrypt.hash(rawPassword, 13, function(err, hash) {
    if(err) return console.error(err);
    console.log(hash);
});
