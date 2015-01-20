/**
 * Tic Tac Toe Server - Allow single player and multiplayer games
 * Require: MongoDB Service started, Redis Service started
 */

'use strict';

var cluster = require('cluster');

/**
 * Horizontally Scaling Node.js and WebSockets with Redis.
 */
if (cluster.isMaster) {
    var cpuCount = require('os').cpus().length;
    for (var i = 0; i < cpuCount; i += 1) {
        cluster.fork();
    }

    cluster.on('listening', function(worker) {
        console.log('Worker started: ' + worker.id);
    });

    cluster.on('exit', function(worker) {
        console.log('Worker exit: ' + worker.id);
        cluster.fork();
    });
} else {
    var express = require('express'),
        app = express(),
        env = process.env.NODE_ENV || 'production',
        config = require('./server/configs/config')[env];

    require('./server/configs/express')(app, config);
    require('./server/configs/mongoose')(config);
    require('./server/configs/routes')(app);

    require('./server/configs/redis')();

    var io = require('socket.io').listen(app.listen(config.port));
    require('./server/configs/socket.io')(io);

    console.log('Worker listen at port: ' + config.port);
}