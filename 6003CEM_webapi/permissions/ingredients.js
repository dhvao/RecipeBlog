const AccessControl = require('role-acl');
const ac = new AccessControl();
/**
 * This code defines Role-Based Access Control (RBAC) rules for managing 'ingredients' 
 * using the 'role-acl' library.  See below for permission specifics and the 
 * enforcement functions ('update' and 'delete').
 * @author Toma
 */

ac
  .grant('user')
  .condition({Fn:'EQUALS', args: {'requester':'$.owner'}})
  .execute('update')
  .on('ingredients');

ac
  .grant('admin')
  .execute('delete')
  .on('ingredients');


exports.update = (requester, data) => {
    console.log(requester)
    console.log(data)
  return ac
    .can(requester.role)
    .context({requester:requester.ID, owner:data.authorID})
    .execute('update')
    .sync()
    .on('ingredients');
}

exports.delete = (requester) => {
  return ac
    .can(requester.role)
    .execute('delete')
    .sync()
    .on('ingredients');
}
