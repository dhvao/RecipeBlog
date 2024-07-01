/**
 * This code defines Koa router endpoints with a common '/api/v1' prefix.
 * It includes a public route ('/') and a private route ('/private') that
 * requires authentication using the 'auth' middleware.
 * @author Toma
 */
const Router = require('koa-router');
const auth = require('../controllers/auth');

const router = Router({prefix: '/api/v1'});

router.get('/', publicAPI);
/**
 * Handles GET requests to the private endpoint ('/private'). Requires authentication. 
 * @param {Object} ctx - The Koa context object.
 */
router.get('/private', auth, privateAPI);
/**
 * Responds to requests at the public endpoint.
 * @param {Object} ctx - The Koa context object.
 */

function publicAPI(ctx) {  
  ctx.body = {message: 'PUBLIC PAGE: You requested a new message URI (root) of the API'}
}
/**
 * Responds to requests at the private endpoint. Accesses user data from the 
 * Koa context object (populated by the authentication middleware).
 * @param {Object} ctx - The Koa context object.
 */
function privateAPI(ctx) {
  const user = ctx.state.user;
  ctx.body = {message: `Hello ${user.username} you registered on ${user.dateRegistered}`} 
}

module.exports = router;
