import ApiSync from '../src/api-sync';
import AjaxQueue from '../src/ajax-queue';
import { assert, expect } from 'chai';
import sinon from 'sinon';

describe('Api Sync', () => {
    it('should be defined', () => {
        expect(ApiSync).to.be.a('function');
    });

    describe('add method', () => {
        before(() => {
            sinon.stub(AjaxQueue.prototype, 'add').returns(() => {});
        });

        it('should be defined', () => {
            expect(ApiSync.add).to.be.a('function');
        });

        it('should proxy to AjaxQueue.add', () => {
            const a = {};
            ApiSync.add(a);
            assert(AjaxQueue.prototype.add.calledWithMatch(a));
        });
    });

    describe('remove method', () => {
        before(() => {
            sinon.stub(AjaxQueue.prototype, 'remove').returns(() => {});
        });

        it('should be defined', () => {
            expect(ApiSync.remove).to.be.a('function');
        });

        it('should proxy to AjaxQueue.add', () => {
            const a = {};
            ApiSync.remove(a);
            assert(AjaxQueue.prototype.remove.calledWithMatch(a));
        });
    });

    describe('timeout prop', () => {
        it('should be defined', () => {
            expect(ApiSync.timeout).to.be.a('number');
        });
    });
});