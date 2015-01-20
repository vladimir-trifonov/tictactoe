/**
 * User Model
 */
'use strict';

var mongoose = require('mongoose');

var UserSchema = mongoose.Schema({
    username: String,
    active: Boolean
});

mongoose.model('User', UserSchema);