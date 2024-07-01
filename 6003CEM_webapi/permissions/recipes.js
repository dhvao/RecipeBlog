const AccessControl = require('role-acl');
const ac = new AccessControl();

ac
  .grant('user')
  .condition({Fn:'EQUALS', args: {'requester':'$.owner'}})
  .execute('update')
  .on('recipe');

ac
  .grant('admin')
  .execute('update')
  .on('recipe');

ac
  .grant('admin')
  .execute('delete')
  .on('recipe');

exports.update = (requester, data) => {
  return ac
    .can(requester.role)
    .context({requester:requester.ID, owner:data.authorID})
    .execute('update')
    .sync()
    .on('recipe');
}

exports.delete = (requester) => {
  return ac
    .can(requester.role)
    .execute('delete')
    .sync()
    .on('recipe');
}
