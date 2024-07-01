const AccessControl = require('role-acl');
const ac = new AccessControl();

/**
 * This code implements Role-Based Access Control (RBAC) using the 'role-acl' library. 
 * It defines permissions for 'user' and 'admin' roles specifically for CRUD 
 * operations on 'article' resources. The 'update' and 'delete' functions enforce
 * these permissions during runtime.
 */

ac
  .grant('user')
  .condition({ Fn: 'EQUALS', args: { 'requester': '$.owner' } })
  .execute('update')
  .on('article');

ac
  .grant('admin')
  .execute('update')
  .on('article');

ac
  .grant('admin')
  .execute('delete')
  .on('article');

exports.update = (requester, data) => {
  console.log('Requester:', requester);
  console.log('Data:', data);
  const permission = ac
    .can(requester.role)
    .context({ requester: requester.ID, owner: data.authorID })
    .execute('update')
    .sync()
    .on('article');

  console.log('Permission:', permission);
  return permission;
}

exports.delete = (requester) => {
  console.log('Requester:', requester);
  const permission = ac
    .can(requester.role)
    .execute('delete')
    .sync()
    .on('article');

  console.log('Permission:', permission);
  return permission;
}
