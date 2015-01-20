/**
 * Controls all user MongoDb operations 
 */
'use strict';
var User = require('mongoose').model('User'),
	sanitize = require('mongo-sanitize'),
	Q = require('q');

module.exports = {
	login: login,
	getAllActive: getAllActive,
	setActive: setActive,
	setNotActive: setNotActive,
	getUserById: getUserById
};

function login(req, res) {
	var clean = sanitize(req.body.username);
	var user = new User();
	user.username = clean;

	User.create(user, function(err, user) {
		if (err) {
			return res.status(500).send(err);
		}

		res.send({
			success: true,
			userId: user._id
		});
	});
}

function getAllActive() {
	var defer = Q.defer();
	User.find({
		active: true
	}, function(err, users) {
		if (err) {
			return defer.reject(new Error(err));
		}
		defer.resolve(users);
	});

	return defer.promise;
}

function setActive(userId) {
	User.update({
			_id: userId
		}, {
			$set: {
				active: true
			}
		}, {
			upsert: false
		},
		function(err) {
			if (err) {
				return console.log(err);
			}
		});
}

function setNotActive(userId) {
	User.update({
			_id: userId
		}, {
			$set: {
				active: false
			}
		}, {
			upsert: false
		},
		function(err) {
			if (err) {
				return console.log(err);
			}
		});
}

function getUserById(_id) {
	var defer = Q.defer();

	User.find({
		_id: _id
	}, function(err, users) {
		if (err) {
			return defer.reject(new Error(err));
		}

		if (users.length === 1) {
			defer.resolve(users[0]);
		}

		defer.resolve();
	});

	return defer.promise;
}