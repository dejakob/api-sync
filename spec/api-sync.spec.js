import { ACTION_TYPES } from '../src/config';
import ApiSync from '../src/api-sync';
import AjaxQueue from '../src/ajax-queue';
import { assert, expect } from 'chai';
import sinon from 'sinon';

describe('Api Sync', () => {
    let sandbox = null;

    it('should be defined', () => {
        expect(ApiSync).to.be.a('object');
    });

    describe('add method', () => {
        before(() => {
            sandbox = sinon.sandbox.create();
            sandbox.stub(ApiSync.worker, 'postMessage').returns(() => {});
            sandbox.stub(Date, 'now').returns('A');
            sandbox.stub(Math, 'random').returns('B');
        });

        after (() => {
            sandbox.restore();
        });

        it('should be defined', () => {
            expect(ApiSync.add).to.be.a('function');
        });

        it('should post a message to the web worker', () => {
            const type = 'post';
            const url = '/test';
            const data = {};
            const options = {};

            ApiSync.add(type, url, data, options);

            expect(ApiSync.worker.postMessage.firstCall.args[0])
                .to.eql({
                    action: ACTION_TYPES.ADD_ITEM_TO_QUEUE,
                    optionsKey: 'A-B',
                    type,
                    url,
                    data
                });
        });
    });

    describe('remove method', () => {
        before(() => {
            sandbox = sinon.sandbox.create();
            sandbox.stub(ApiSync.worker, 'postMessage').returns(() => {});
        });

        after (() => {
            sandbox.restore();
        });

        it('should be defined', () => {
            expect(ApiSync.remove).to.be.a('function');
        });

        it('should post a message to the web worker', () => {
            const type = 'post';
            const url = '/test';

            ApiSync.remove(type, url);

            expect(ApiSync.worker.postMessage.firstCall.args[0])
                .to.eql({
                    action: ACTION_TYPES.REMOVE_FROM_QUEUE,
                    type,
                    url
                });
        });
    });

    describe('set timeout prop', () => {
        before(() => {
            sandbox = sinon.sandbox.create();
            sandbox.stub(ApiSync.worker, 'postMessage').returns(() => {});
        });

        after (() => {
            sandbox.restore();
        });

        it('should post a message to the web worker', () => {
            ApiSync.timeout = 200;

            expect(ApiSync.worker.postMessage.firstCall.args[0])
                .to.eql({
                    action: ACTION_TYPES.SET_TIMEOUT,
                    timeout: 200
                });
        });
    });

    describe('_processIncomingMessage method', () => {
        it('should be defined', () => {
            expect(ApiSync._processIncomingMessage).to.be.a('function');
        });

        describe('when message action is LOG_ERROR', () => {
            before(() => {
                sandbox = sinon.sandbox.create();
                sandbox.stub(ApiSync, '_logError').returns(() => {});
            });

            after (() => {
                sandbox.restore();
            });

            it('should call _logError with the errorMessage', () => {
                const action = ACTION_TYPES.LOG_ERROR;
                const data = {
                    action,
                    errorMessage: 'ERROR'
                };

                ApiSync._processIncomingMessage({ data });

                expect(ApiSync._logError.firstCall.args[0])
                    .to.eql(data.errorMessage);
            });
        });

        describe('when message action is ON_COMPLETE', () => {
            before(() => {
                sandbox = sinon.sandbox.create();
                sandbox.stub(ApiSync, '_onComplete').returns(() => {});
            });

            after (() => {
                sandbox.restore();
            });

            it('should call _logError with the errorMessage', () => {
                const action = ACTION_TYPES.ON_COMPLETE;
                const data = {
                    action,
                    optionsKey: 'A-B',
                    response: {}
                };

                ApiSync._processIncomingMessage({ data });

                expect(ApiSync._onComplete.firstCall.args[0])
                    .to.eql(data.optionsKey, data.response);
            });
        });

        describe('when message action is ON_FAILED', () => {
            before(() => {
                sandbox = sinon.sandbox.create();
                sandbox.stub(ApiSync, '_onFailed').returns(() => {});
            });

            after (() => {
                sandbox.restore();
            });

            it('should call _logError with the errorMessage', () => {
                const action = ACTION_TYPES.ON_FAILED;
                const data = {
                    action,
                    optionsKey: 'A-B',
                    errorDetails: {}
                };

                ApiSync._processIncomingMessage({ data });

                expect(ApiSync._onFailed.firstCall.args[0])
                    .to.eql(data.optionsKey, data.errorDetails);
            });
        });
    });


});