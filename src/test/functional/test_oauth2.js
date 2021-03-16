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

    const signInStubValue = {
        "id": "4",
        "name": "Víctor",
        "last_name": "Macêdo",
        "phone": "+5532984747808",
        "email": "ovictormacedo@gmail.com"
    }

    const getOauthByUserIdStubValue = {
        "dataValues": {            
            "id": 1,
            "user_id": "4",
            "access_token": "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjp7ImlkIjoiNCIsIm5hbWUiOiJWw61jdG9yIiwibGFzdF9uYW1lIjoiTWFjw6pkbyIsInBob25lIjoiKzU1MzI5ODQ3NDc4MDgiLCJlbWFpbCI6Im92aWN0b3JtYWNlZG9AZ21haWwuY29tIn0sImV4cCI6MTYxNTg1OTU4MTkyMH0.H1yWyZMWbZngrRlmmkqT8TLjjykZ2qETrtgdpHUak1w",
            "refresh_token": "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjp7ImlkIjoiNCIsIm5hbWUiOiJWw61jdG9yIiwibGFzdF9uYW1lIjoiTWFjw6pkbyIsInBob25lIjoiKzU1MzI5ODQ3NDc4MDgiLCJlbWFpbCI6Im92aWN0b3JtYWNlZG9AZ21haWwuY29tIn0sImV4cCI6MTYxNTg2MzE4MTkyMH0.tZuA48RU1FjVo5W-78sCfnfGO6a8wDj4TWRFIjUMRM0",
            "expiration_token": 1615859581920,
            "expiration_refresh_token": 1615863181920
        }
    }

    
    describe("Authorize user", () => {
        it("authorize user for the first time", (done) => {
            sinon.stub(service, "signIn").returns(signInStubValue);
            sinon.stub(oauth2Dao, "getOauthByUserId").returns(null);
            sinon.stub(service, "authorize").returns(getOauthByUserIdStubValue);
            
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
            sinon.stub(service, "signIn").returns(signInStubValue);
            sinon.stub(oauth2Dao, "getOauthByUserId").returns(getOauthByUserIdStubValue);
            sinon.stub(service, "authorize").returns(getOauthByUserIdStubValue);
            
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
                    console.log(res.body)
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
            sinon.stub(service, "signIn").returns(signInStubValue);
            sinon.stub(oauth2Dao, "getOauthByUserId").returns(getOauthByUserIdStubValue);
            sinon.stub(service, "authorize").returns(getOauthByUserIdStubValue);
            
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
});