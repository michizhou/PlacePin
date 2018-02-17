/**
 * Module Dependencies
 */
const errors = require('restify-errors');
var twilio = require('twilio');

/**
 * Model Schema
 */
const Rating = require('../models/todo');

module.exports = function(server) {

    /**
     * POST
     */
    server.post('/rating', (req, res, next) => {
        if (!req.is('application/json')) {
        return next(
            new errors.InvalidContentError("Expects 'application/json'"),
        );
    }

    let data = req.body || {};

    let todo = new Rating(data);
    todo.save(function(err) {
            if (err) {
                console.error(err);
                return next(new errors.InternalError(err.message));
                next();
            }

            res.send(201);
            next();
        });
    });

    /**
     * LIST
     */
    server.get('/ratings', (req, res, next) => {
        Rating.apiQuery(req.params, function(err, docs) {
            if (err) {
                console.error(err);
                return next(
                    new errors.InvalidContentError(err.errors.name.message),
                );
            }

            res.send(docs);
            next();
        });
    });

    /**
     * GET
     */
    server.get('/rating/:rating_id', (req, res, next) => {
        Todo.findOne({ _id: req.params.rating_id }, function(err, doc) {
            if (err) {
                console.error(err);
                return next(
                    new errors.InvalidContentError(err.errors.name.message),
                );
            }

            res.send(doc);
            next();
        });
    });

    /**
     * UPDATE
     */
    server.put('/rating/:rating_id', (req, res, next) => {
        if (!req.is('application/json')) {
            return next(
                new errors.InvalidContentError("Expects 'application/json'"),
            );
        }

        let data = req.body || {};

        if (!data._id) {
            data = Object.assign({}, data, { _id: req.params.rating_id });
        }

        Rating.findOne({ _id: req.params.rating_id }, function(err, doc) {
            if (err) {
                console.error(err);
                return next(
                    new errors.InvalidContentError(err.errors.name.message),
                );
            } else if (!doc) {
                return next(
                    new errors.ResourceNotFoundError(
                        'The resource you requested could not be found.',
                    ),
                );
            }

            Rating.update({ _id: data._id }, data, function(err) {
                if (err) {
                    console.error(err);
                    return next(
                        new errors.InvalidContentError(err.errors.name.message),
                    );
                }

                res.send(200, data);
                next();
            });
        });
    });

    /**
     * DELETE
     */
    server.del('/rating/:rating_id', (req, res, next) => {
        Rating.remove({ _id: req.params.rating_id }, function(err) {
            if (err) {
                console.error(err);
                return next(
                    new errors.InvalidContentError(err.errors.name.message),
                );
            }

            res.send(204);
            next();
        });
    });
};