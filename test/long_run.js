/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

/*
 * Copyright (c) 2014, Joyent, Inc.
 */

var assert = require('assert-plus');
var bunyan = require('bunyan');
var libuuid = require('libuuid');

var moray = require('../lib');



///--- Globals

var BUCKET = 't' + libuuid.create().substr(0, 7);
var CONFIG = {
    index: {
        foo: {
            type: 'string'
        }
    }
};



///--- Mainline
(function main() {
    var client = moray.createClient({
        mustCloseBeforeNormalProcessExit: true,
        connectTimeout: 1000,
        dns: {
            checkInterval: 2000,
            // resolvers: ['10.99.99.201'],
            timeout: 500
        },
        log: bunyan.createLogger({
            name: 'moray_client',
            level: process.env.LOG_LEVEL || 'info',
            stream: process.stdout
        }),
        maxConnections: 100,
        retry: {retries: 2},
        url: process.env.MORAY_URL || 'tcp://127.0.0.1:2020'
    });

    client.once('connect', function () {
        client.putBucket(BUCKET, CONFIG, function (init_err) {
            assert.ifError(init_err);

            var MAX = 25000;
            function run() {
                var done = 0;
                function cb(err) {
                    if (err) {
                        console.error('put failed: %s',
                                      err.toString());
                    }

                    if (++done === MAX) {
                        function d_cb(derr) {
                            assert.ifError(derr);
                            client.close();
                        }
                        client.deleteBucket(BUCKET,
                                            d_cb);
                    }
                }

                function put(k, v) {
                    function p_cb(err) {
                        assert.ifError(err);
                        client.getObject(BUCKET, k, cb);
                    }
                    client.putObject(BUCKET, k, v, p_cb);
                }

                for (var i = 0; i < MAX; i++) {
                    var _k = libuuid.create();
                    var _v = {
                        foo: '' + i
                    };
                    put(_k, _v);
                }
            }

            run();
        });
    });
})();
