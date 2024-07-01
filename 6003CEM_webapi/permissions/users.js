const AccessControl = require('role-acl');
const ac = new AccessControl();

/**
 * This code implements Role-Based Access Control (RBAC) for managing 'user' records.
 * It enforces granular permissions for 'user' and 'admin' roles, including conditional
 * ownership checks and restrictions on accessing sensitive fields (password, passwordSalt).
 * 
 * // Users can read their own profile (excluding password fields)
 */ 
ac
  .grant('user')
  .condition({Fn:'EQUALS', args: {'requester':'$.owner'}})
  .execute('read')
  .on('user', ['*', '!password', '!passwordSalt']);
// Users can update their own profile (including password)
ac
  .grant('user')
  .condition({Fn:'EQUALS', args: {'requester':'$.owner'}})
  .execute('update')
  .on('user', ['firstName', 'lastName', 'about', 'password', 'email', 'avatarURL']);
// Admins have read access to all user profiles
ac
  .grant('admin')
  .execute('read')
  .on('user');

ac
  .grant('admin')
  .execute('read')
  .on('users');

ac
  .grant('admin')
  .execute('update')
  .on('user');

// Admins can delete any user except themselves
ac
  .grant('admin')
  .condition({Fn:'NOT_EQUALS', args: {'requester':'$.owner'}})
  .execute('delete')
  .on('user');

exports.readAll = (requester) => {
  return ac
    .can(requester.role)
    .execute('read')
    .sync()
    .on('users');
}

exports.read = (requester, data) => {
  return ac
    .can(requester.role)
    .context({requester:requester.ID, owner:data.ID})
    .execute('read')
    .sync()
    .on('user');
}

exports.update = (requester, data) => {
  return ac
    .can(requester.role)
    .context({requester:requester.ID, owner:data.ID})
    .execute('update')
    .sync()
    .on('user');
}

exports.delete = (requester, data) => {
  return ac
    .can(requester.role)
    .context({requester:requester.ID, owner:data.ID})
    .execute('delete')
    .sync()
    .on('user');
}
