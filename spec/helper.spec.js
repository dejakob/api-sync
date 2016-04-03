import Helper from '../src/helper';
import { expect } from 'chai';

describe('Helper', () => {
    it('should be defined', () => {
        expect(Helper).to.be.a('function');
    });

    describe('mergeRequests method', () => {
        it('should be defined', () => {
            expect(Helper.mergeRequests).to.be.a('function');
        });

        it('should return an object', () => {
            expect(Helper.mergeRequests([{}])).to.be.a('object');
        });

        describe('returned type prop', () => {
            it('should be the type of the first request', () => {
                const request1 = { type: 'POST', url: '/todo' };
                const request2 = { type: 'POST', url: '/todo' };
                const request3 = { type: 'POST', url: '/todo' };

                expect(Helper.mergeRequests([ request1, request2, request3 ]).type)
                    .to.equal(request1.type);
            });
        });

        describe('returned url prop', () => {
            it('should be the url of the first request', () => {
                const request1 = { type: 'POST', url: '/todo' };
                const request2 = { type: 'POST', url: '/todo' };
                const request3 = { type: 'POST', url: '/todo' };

                expect(Helper.mergeRequests([ request1, request2, request3 ]).url)
                    .to.equal(request1.url);
            });
        });

        describe('returned data prop', () => {
            it('should be the data of the first request', () => {
                const request1 = { type: 'POST', url: '/todo', data: { test: 123 } };
                const request2 = { type: 'POST', url: '/todo', data: { test: 456 } };
                const request3 = { type: 'POST', url: '/todo', data: { title: 'test' } };

                expect(Helper.mergeRequests([ request1, request2, request3 ]).data)
                    .to.eql({
                        test: 456,
                        title: 'test'
                    });
            });
        });

        describe('options prop', () => {
            it('should be the options of the first request', () => {
                const request1 = { type: 'POST', url: '/todo', data: {}, options: { a: 222 } };
                const request2 = { type: 'POST', url: '/todo', data: {}, options: { a: 333 } };

                expect(Helper.mergeRequests([ request1, request2 ]).options)
                    .to.equal(request1.options);
            });
        });
    });
});