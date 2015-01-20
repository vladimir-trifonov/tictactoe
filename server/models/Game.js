/**
 * Game Model
 */
'use strict';

var mongoose = require('mongoose');

var GameSchema = mongoose.Schema({
    userids: [String],
    gamedata: {}
});

mongoose.model('Game', GameSchema);