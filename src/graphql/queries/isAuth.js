const isAuth = (_, __, { user }) => Boolean(user);

module.exports = { isAuth };
