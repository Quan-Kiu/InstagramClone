const authRoute = require('./auth');
const siteRoute = require('./site');
const userRoute = require('./user');
const postRoute = require('./post');
const commentRoute = require('./comment');
const notifyRoute = require('./notify');
const messageRoute = require('./message');

function routes(app) {
    app.use('/api', authRoute);
    app.use('/', siteRoute);
    app.use('/api', userRoute);
    app.use('/api', postRoute);
    app.use('/api', commentRoute);
    app.use('/api', notifyRoute);
    app.use('/api', messageRoute);
}

module.exports = routes;
