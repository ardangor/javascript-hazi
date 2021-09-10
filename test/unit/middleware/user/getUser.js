const expect = require('chai').expect;
const getUser = require("./../../../../middleware/user/getUser");

describe('getUser middleware test', function () {
    it('should return searched user', function (done) {
        const mw = getUser({
            User: {
                findOne: (p1, cb) => {
                    expect(p1).to.be.eql({ _id: 10 });
                    cb(null, 'mockuser');
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
            () => {
                expect(resMock.locals).to.be.eql({ user: 'mockuser' });
                done();
            });
    });

    it('should be database error', function (done) {
        const mw = getUser({
            User: {
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