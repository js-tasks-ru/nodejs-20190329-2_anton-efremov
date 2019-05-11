const User = require('../../models/User');

module.exports = async function authenticate(strategy, email, displayName, done) {
  
  try {
    if (!email) {
      return done(null, false, 'Не указан email');
    }

    let user = await User.findOne({email});
    if (!user) {
      const userObj = {'displayName': displayName, 'email': email};
      user = await User.create(userObj);
    }

    return done(null, user);

  } catch (err) {
    done(err);
  }
};
