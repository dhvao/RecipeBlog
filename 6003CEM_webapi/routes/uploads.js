const { copyFileSync, existsSync, createReadStream, mkdirSync } = require('fs');
const { v4: uuidv4 } = require('uuid');
const mime = require('mime-types');
const Router = require('koa-router');
const auth = require('../controllers/auth');

const upload_options = {
    multipart: true,
    formidable: {
        uploadDir: '/tmp/api/uploads'
    }
}
const koaBody = require('koa-body')(upload_options);

const prefix = '/api/v1';
const router = Router({ prefix: prefix });

// Define the new persistent directory for images
const fileStore = '/home/codio/workspace/6003CEM_webapi/uploads/images';
if (!existsSync(fileStore)) {
    mkdirSync(fileStore, { recursive: true });
}

router.post('/images', auth, koaBody, async ctx => {
    try {
        console.log("Received request files:", ctx.request.files);
        
        const fileKey = Object.keys(ctx.request.files)[0]; // Assuming the first key is the file key
        const { path, name, type } = ctx.request.files[fileKey];
        const extension = mime.extension(type);
        const imageName = uuidv4() + '.' + extension;
        const newPath = `${fileStore}/${imageName}`;
        copyFileSync(path, newPath);

        ctx.status = 201;
        ctx.body = {
            links: {
                path: `/uploads/images/${imageName}`
            }
        };
    } catch (err) {
        console.log(`Error during file upload: ${err.message}`);
        ctx.throw(500, 'upload error', { message: err.message });
    }
});

router.get('get_image', '/uploads/images/:uuid', async ctx => {
    const uuid = ctx.params.uuid;
    const path = `${fileStore}/${uuid}`;
    try {
        if (existsSync(path)) {
            const src = createReadStream(path);
            ctx.type = mime.lookup(path);
            ctx.body = src;
            ctx.status = 200;
        } else {
            ctx.status = 404;
        }
    } catch (err) {
        console.log(`Error during file download: ${err.message}`);
        ctx.throw(500, 'image download error', { message: err.message });
    }
});

module.exports = router;
