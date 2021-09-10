const expect = require('chai').expect;
const getWork = require("./../../../../middleware/work/getWork");

describe('getWork middleware test', function () {
    it('should return searched work', function (done) {
        const mw = getWork({
            Work: {
                findOne: (p1, cb) => {
                    expect(p1).to.be.eql({ _id: 15 });
                    cb(null, 'mockwork');
                }
            }
        });

        const resMock = {
            locals: {}
        }

        mw({
            params: {
                work_id: 15
            }
        },
            resMock,
            () => {
                expect(resMock.locals).to.be.eql({ work: 'mockwork' });
                done();
            });
    });


    it('should be database error', function (done) {
        const mw = getWork({
            Work: {
                findOne: (p1, cb) => {
                    cb('databaseError', null);
                }
            }
        });

        const resMock = {
            locals: {}
        }

        mw({
            params: {
                user_id: 10
            }
        },
            resMock,
            (err) => {
                expect(err).to.be.eql('databaseError');
                done();
            });
    });
});