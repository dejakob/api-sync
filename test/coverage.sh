#!/bin/bash
babel-node ./node_modules/.bin/babel-istanbul cover --dir coverage/coverage ./node_modules/.bin/_mocha spec/**/*.spec.js --compilers node_modules/babel-core/register