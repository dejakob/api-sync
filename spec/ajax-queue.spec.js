import AjaxQueue from '../src/ajax-queue';
import { expect } from 'chai';

describe('Ajax Queue', () => {
    let ajaxQueue = null;

    beforeEach(() => {
        ajaxQueue = new AjaxQueue();
    });

    describe('add method', () => {
        it('should be defined', () => {
            expect(ajaxQueue.add).to.be.a('function');
        });

        it('should add an item to the queue', () => {
            const type = 'post';
            const url = '/todo';
            const data = {};
            const options = {};

            ajaxQueue.add(type, url, data);

            expect(ajaxQueue._queue)
                .to.eql({
                    'post|/todo': [{ type, url, data, options }]
                });
        });

        it('should add two item to the queue', () => {
            const type = 'post';
            const url = '/todo';
            const data = {};
            const options = {};

            ajaxQueue.add(type, url, data);
            ajaxQueue.add(type, url, data);

            expect(ajaxQueue._queue)
                .to.eql({
                    'post|/todo': [{ type, url, data, options }, { type, url, data, options }]
                });
        });
    });
});