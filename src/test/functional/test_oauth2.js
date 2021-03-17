process.env.NODE_ENV = 'test';
process.env.APP_LOG_PATH="./oauth2.log"

const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
const sinon = require("sinon")
const { router } = require("../../bootstrap/router")
let { app } = require('../../bootstrap/app')
const userDao = require("../../dao/user")
const oauth2Dao = require("../../dao/oauth2")
const service = require("../../service/authorize")


chai.use(chaiHttp);

describe('Oauth2', () => {
    before(() => {
        router(app());
    });

    afterEach(() => {
        sinon.restore();
    });

    const userStubValue = {
        "id": "4",
        "name": "Víctor",
        "last_name": "Macêdo",
        "phone": "+5532984747808",
        "email": "ovictormacedo@gmail.com"
    }

    const oauth2StubValue = {
        "dataValues": {            
            "id": 1,
            "user_id": "4",
            "access_token": "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjp7ImlkIjoiNCIsIm5hbWUiOiJWw61jdG9yIiwibGFzdF9uYW1lIjoiTWFjw6pkbyIsInBob25lIjoiKzU1MzI5ODQ3NDc4MDgiLCJlbWFpbCI6Im92aWN0b3JtYWNlZG9AZ21haWwuY29tIn0sImV4cCI6MTYxNTg1OTU4MTkyMH0.H1yWyZMWbZngrRlmmkqT8TLjjykZ2qETrtgdpHUak1w",
            "refresh_token": "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjp7ImlkIjoiNCIsIm5hbWUiOiJWw61jdG9yIiwibGFzdF9uYW1lIjoiTWFjw6pkbyIsInBob25lIjoiKzU1MzI5ODQ3NDc4MDgiLCJlbWFpbCI6Im92aWN0b3JtYWNlZG9AZ21haWwuY29tIn0sImV4cCI6MTYxNTg2MzE4MTkyMH0.tZuA48RU1FjVo5W-78sCfnfGO6a8wDj4TWRFIjUMRM0",
            "expiration_token": 1615859581920,
            "expiration_refresh_token": 1615863181920
        }
    }

    const tokensStubValue = [
        "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjp7ImlkIjoiNCIsIm5hbWUiOiJWw61jdG9yIiwibGFzdF9uYW1l"+
        "IjoiTWFjw6pkbyIsInBob25lIjoiKzU1MzI5ODQ3NDc4MDgiLCJlbWFpbCI6Im92aWN0b3JtYWNlZG9AZ2"+
        "1haWwuY29tIn0sImV4cCI6MTYxNjAyNjg0MzgzMn0.Tb8l2ogffCQLB5Q5NDsEoazNTYkbm0jG2KxNCrFdhWk",
        "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjp7ImlkIjoiNCIsIm5hbWUiOiJWw61jdG9yIiwibGFzdF9uYW1lIjoi"+
        "TWFjw6pkbyIsInBob25lIjoiKzU1MzI5ODQ3NDc4MDgiLCJlbWFpbCI6Im92aWN0b3JtYWNlZG9AZ21haWwuY"+
        "29tIn0sImV4cCI6MTYxNjAzMDQ0MzgzMn0.Rl7AqjUSx-zJgya7yDM0j4D9e0mvE2pIPLdhg_D6hRM",
        1616026843832, 1616030443832
    ]

    
    describe("Authorize user", () => {
        it("authorize user for the first time", (done) => {
            sinon.stub(service, "signIn").returns(userStubValue);
            sinon.stub(oauth2Dao, "getOauthByUserId").returns(null);
            sinon.stub(service, "authorize").returns(oauth2StubValue);
            
            chai.request(app())
                .post('/oauth/authorize')
                .set('content-type', 'application/x-www-form-urlencoded')
                .set('grant_type', 'password')
                .send({
                    "username": "ovictormacedo@gmail.com",
                    "password": "test",
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property("user_id")
                    res.body.should.have.property("access_token")
                    res.body.should.have.property("refresh_token")
                    res.body.should.have.property("expiration_token")
                    res.body.should.have.property("expiration_refresh_token")
                    res.body.should.not.have.property("id")
                    done();
                });
        });

        it("authorize user", (done) => {
            sinon.stub(service, "signIn").returns(userStubValue);
            sinon.stub(oauth2Dao, "getOauthByUserId").returns(oauth2StubValue);
            sinon.stub(service, "authorize").returns(oauth2StubValue);
            
            chai.request(app())
                .post('/oauth/authorize')
                .set('content-type', 'application/x-www-form-urlencoded')
                .set('grant_type', 'password')
                .send({
                    "username": "ovictormacedo@gmail.com",
                    "password": "test",
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property("user_id")
                    res.body.should.have.property("access_token")
                    res.body.should.have.property("refresh_token")
                    res.body.should.have.property("expiration_token")
                    res.body.should.have.property("expiration_refresh_token")
                    res.body.should.not.have.property("id")
                    done();
                });
        });

        it("authorize user - Token or refresh token still valid", (done) => {
            sinon.useFakeTimers({now: new Date(2020, 1, 1, 0, 0)})
            sinon.stub(service, "signIn").returns(userStubValue);
            sinon.stub(oauth2Dao, "getOauthByUserId").returns(oauth2StubValue);
            sinon.stub(service, "authorize").returns(oauth2StubValue);
            
            chai.request(app())
                .post('/oauth/authorize')
                .set('content-type', 'application/x-www-form-urlencoded')
                .set('grant_type', 'password')
                .send({
                    "username": "ovictormacedo@gmail.com",
                    "password": "test",
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property("user_id")
                    res.body.should.have.property("access_token")
                    res.body.should.have.property("refresh_token")
                    res.body.should.have.property("expiration_token")
                    res.body.should.have.property("expiration_refresh_token")
                    res.body.should.not.have.property("id")
                    done();
                });
        });
    });

    describe("Refresh token", () => {
        it("refresh token still valid", (done) => {
            sinon.useFakeTimers({now: new Date(2020, 1, 1, 0, 0, 0)})
            sinon.stub(oauth2Dao, "getOauthByRefreshToken").returns(oauth2StubValue);
            
            chai.request(app())
                .post('/oauth/refresh')
                .set('content-type', 'application/x-www-form-urlencoded')
                .set('grant_type', 'refresh')
                .set('authorization', "Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjp7ImlkIjoiN"+
                "CIsIm5hbWUiOiJWw61jdG9yIiwibGFzdF9uYW1lIjoiTWFjw6pkbyIsInBob25lIjoiKzU1M"+
                "zI5ODQ3NDc4MDgiLCJlbWFpbCI6Im92aWN0b3JtYWNlZG9AZ21haWwuY29tIn0sImV4cCI6MT"+
                "YxNTg2NTU5NTQ1OH0.V1UMhUtonxOlg7hLnJdfoZwaS6DgG8nU5CHds8E9gic")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property("user_id")
                    res.body.should.have.property("access_token")
                    res.body.should.have.property("refresh_token")
                    res.body.should.have.property("expiration_token")
                    res.body.should.have.property("expiration_refresh_token")
                    res.body.should.not.have.property("id")
                    done();
                });
        });

        it("refresh token", (done) => {
            sinon.useFakeTimers({now: new Date(2021, 2, 15, 23, 52, 0)})
            sinon.stub(oauth2Dao, "getOauthByRefreshToken").returns(oauth2StubValue);
            sinon.stub(service, "authorize").returns(oauth2StubValue);
            sinon.stub(service, "generateTokens").returns(tokensStubValue);
            sinon.stub(userDao, "getUserById").returns(userStubValue);
            
            chai.request(app())
                .post('/oauth/refresh')
                .set('content-type', 'application/x-www-form-urlencoded')
                .set('grant_type', 'refresh')
                .set('authorization', "Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjp7ImlkIjoiN"+
                "CIsIm5hbWUiOiJWw61jdG9yIiwibGFzdF9uYW1lIjoiTWFjw6pkbyIsInBob25lIjoiKzU1M"+
                "zI5ODQ3NDc4MDgiLCJlbWFpbCI6Im92aWN0b3JtYWNlZG9AZ21haWwuY29tIn0sImV4cCI6MT"+
                "YxNTg2NTU5NTQ1OH0.V1UMhUtonxOlg7hLnJdfoZwaS6DgG8nU5CHds8E9gic")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property("user_id")
                    res.body.should.have.property("access_token")
                    res.body.should.have.property("refresh_token")
                    res.body.should.have.property("expiration_token")
                    res.body.should.have.property("expiration_refresh_token")
                    res.body.should.not.have.property("id")
                    done();
                });
        });

        it("does not refresh token because it was not found", (done) => {
            sinon.useFakeTimers({now: new Date(2021, 2, 15, 23, 52, 0)})
            sinon.stub(oauth2Dao, "getOauthByRefreshToken").returns(null);
            
            chai.request(app())
                .post('/oauth/refresh')
                .set('content-type', 'application/x-www-form-urlencoded')
                .set('grant_type', 'refresh')
                .set('authorization', "Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjp7ImlkIjoiN"+
                "CIsIm5hbWUiOiJWw61jdG9yIiwibGFzdF9uYW1lIjoiTWFjw6pkbyIsInBob25lIjoiKzU1M"+
                "zI5ODQ3NDc4MDgiLCJlbWFpbCI6Im92aWN0b3JtYWNlZG9AZ21haWwuY29tIn0sImV4cCI6MT"+
                "YxNTg2NTU5NTQ1OH0.V1UMhUtonxOlg7hLnJdfoZwaS6DgG8nU5CHds8E9gic")
                .end((err, res) => {
                    res.should.have.status(401);
                    res.text.should.be.equal("Refresh token expired")
                    done();
                });
        });

        it("does not refresh token because it expired", (done) => {
            sinon.useFakeTimers({now: new Date(2021, 6, 15, 23, 52, 0)})
            sinon.stub(oauth2Dao, "getOauthByRefreshToken").returns(oauth2StubValue);
            
            chai.request(app())
                .post('/oauth/refresh')
                .set('content-type', 'application/x-www-form-urlencoded')
                .set('grant_type', 'refresh')
                .set('authorization', "Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjp7ImlkIjoiN"+
                "CIsIm5hbWUiOiJWw61jdG9yIiwibGFzdF9uYW1lIjoiTWFjw6pkbyIsInBob25lIjoiKzU1M"+
                "zI5ODQ3NDc4MDgiLCJlbWFpbCI6Im92aWN0b3JtYWNlZG9AZ21haWwuY29tIn0sImV4cCI6MT"+
                "YxNTg2NTU5NTQ1OH0.V1UMhUtonxOlg7hLnJdfoZwaS6DgG8nU5CHds8E9gic")
                .end((err, res) => {
                    res.should.have.status(401);
                    res.text.should.be.equal("Refresh token expired")
                    done();
                });
        });
    })
});