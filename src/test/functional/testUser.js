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

describe('User', () => {
    let userStubValue = {
        "id": "1",
        "name": "Test",
        "last_name": "Test",
        "phone": "+5532900000000",
        "email": "test@email.com",
        "password": "test",
        "roles": [
            {
                "id": "3",
                "name": "tenant"
            }
        ],
    }

    let userPayload = new Object();

    before(() => {
        router(app());
        Object.assign(userPayload, userStubValue);
        userPayload.roles = undefined;
        userPayload.id = undefined;
        userPayload.role = "tenant";
    });

    afterEach(() => {
        sinon.restore();
        userStubValue["password"] = "test"
        Object.assign(userPayload, userStubValue);
        userPayload.roles = undefined;
        userPayload.id = undefined;
        userPayload.role = "tenant";
    });

    const oauth2StubValue = {
        "dataValues": {            
            "id": 1,
            "user_id": "4",
            "access_token": "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjp7ImlkIjoiNSIsIm5hbWUiOiJUZXN0IiwibGFzdF9uYW1lIjoiVGVzdCIsInBob25lIjoiKzU1MzI5MDAwMDAwMDAiLCJlbWFpbCI6InRlc3RAZW1haWwuY29tIn0sImV4cCI6MTYxNjAzMjEzMjMyMH0.vThbeVYiexs6ii9oxKTNnqw6A4ilk84G6RLTnyUGpGw",
            "refresh_token": "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjp7ImlkIjoiNSIsIm5hbWUiOiJUZXN0IiwibGFzdF9uYW1lIjoiVGVzdCIsInBob25lIjoiKzU1MzI5MDAwMDAwMDAiLCJlbWFpbCI6InRlc3RAZW1haWwuY29tIn0sImV4cCI6MTYxNjAzNTczMjMyMX0.ncGLDPzcJ4aJsj7GlNsAIwTRoKYg1HwI82U0A5lSKS4",
            "expiration_token": 1615859581920,
            "expiration_refresh_token": 1615863181920
        }
    }

    const tokensStubValue = [
        oauth2StubValue["dataValues"]["access_token"],
        oauth2StubValue["dataValues"]["refresh_token"],
        oauth2StubValue["dataValues"]["expiration_token"],
        oauth2StubValue["dataValues"]["expiration_refresh_token"],   
    ]

    
    describe("Get user", () => {
        it("get user by id", (done) => {
            sinon.stub(userDao, "getUserById").returns(userStubValue);
            sinon.stub(service, "validateToken").returns(Promise.resolve(true));
            
            chai.request(app())
                .get('/api/authentication/user/id/1')
                .set('content-type', 'application/x-www-form-urlencoded')
                .set('grant_type', 'password')
                .set('authorization', "Bearer "+oauth2StubValue["dataValues"]["access_token"])
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property("id")
                    res.body.should.have.property("name")
                    res.body.should.have.property("last_name")
                    res.body.should.have.property("email")
                    res.body.should.have.property("phone")
                    res.body.should.not.have.property("password")
                    done();
                });
        });

        it("get user by id - not found", (done) => {
            sinon.stub(userDao, "getUserById").returns(null);
            sinon.stub(service, "validateToken").returns(Promise.resolve(true));
            
            chai.request(app())
                .get('/api/authentication/user/id/1')
                .set('content-type', 'application/x-www-form-urlencoded')
                .set('grant_type', 'password')
                .set('authorization', "Bearer "+oauth2StubValue["dataValues"]["access_token"])
                .end((err, res) => {
                    res.should.have.status(200);
                    res.text.should.be.equal("User not found")
                    done();
                });
        });

        it("get user by email", (done) => {
            sinon.stub(userDao, "getUserByEmail").returns(userStubValue);
            sinon.stub(service, "validateToken").returns(Promise.resolve(true));
            
            chai.request(app())
                .get('/api/authentication/user/email/test@email.com')
                .set('content-type', 'application/x-www-form-urlencoded')
                .set('grant_type', 'password')
                .set('authorization', "Bearer "+oauth2StubValue["dataValues"]["access_token"])
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property("id")
                    res.body.should.have.property("name")
                    res.body.should.have.property("last_name")
                    res.body.should.have.property("email")
                    res.body.should.have.property("phone")
                    res.body.should.not.have.property("password")
                    done();
                });
        });

        it("get user by email - not found", (done) => {
            sinon.stub(userDao, "getUserByEmail").returns(null);
            sinon.stub(service, "validateToken").returns(Promise.resolve(true));
            
            chai.request(app())
                .get('/api/authentication/user/email/test@email.com')
                .set('content-type', 'application/x-www-form-urlencoded')
                .set('grant_type', 'password')
                .set('authorization', "Bearer "+oauth2StubValue["dataValues"]["access_token"])
                .end((err, res) => {
                    res.should.have.status(200);
                    res.text.should.be.equal("User not found")
                    done();
                });
        });

        it("get user by phone", (done) => {
            sinon.stub(userDao, "getUserByPhone").returns(userStubValue);
            sinon.stub(service, "validateToken").returns(Promise.resolve(true));
            
            chai.request(app())
                .get('/api/authentication/user/phone/+5532900000000')
                .set('content-type', 'application/x-www-form-urlencoded')
                .set('grant_type', 'password')
                .set('authorization', "Bearer "+oauth2StubValue["dataValues"]["access_token"])
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property("id")
                    res.body.should.have.property("name")
                    res.body.should.have.property("last_name")
                    res.body.should.have.property("email")
                    res.body.should.have.property("phone")
                    res.body.should.not.have.property("password")
                    done();
                });
        });

        it("get user by phone - not found", (done) => {
            sinon.stub(userDao, "getUserByPhone").returns(null);
            sinon.stub(service, "validateToken").returns(Promise.resolve(true));
            
            chai.request(app())
                .get('/api/authentication/user/phone/+5532900000000')
                .set('content-type', 'application/x-www-form-urlencoded')
                .set('grant_type', 'password')
                .set('authorization', "Bearer "+oauth2StubValue["dataValues"]["access_token"])
                .end((err, res) => {
                    res.should.have.status(200);
                    res.text.should.be.equal("User not found")
                    done();
                });
        });

        it("sign up user - email already used", (done) => {
            sinon.stub(userDao, "getUserByEmail").returns(userStubValue);
            sinon.stub(service, "validateToken").returns(Promise.resolve(true));
            
            chai.request(app())
                .post('/api/authentication/user/signup')
                .set('content-type', 'application/x-www-form-urlencoded')
                .set('grant_type', 'password')
                .set('authorization', "Bearer "+oauth2StubValue["dataValues"]["access_token"])
                .send(userPayload)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.text.should.be.equal("Email already used")
                    done();
                });
        });

        it("sign up user", (done) => {
            sinon.stub(userDao, "getUserByEmail").returns(null);
            sinon.stub(userDao, "signUp").returns(userStubValue);
            sinon.stub(service, "validateToken").returns(Promise.resolve(true));
            
            chai.request(app())
                .post('/api/authentication/user/signup')
                .set('content-type', 'application/x-www-form-urlencoded')
                .set('grant_type', 'password')
                .set('authorization', "Bearer "+oauth2StubValue["dataValues"]["access_token"])
                .send(userPayload)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property("id")
                    res.body.should.have.property("name")
                    res.body.should.have.property("last_name")
                    res.body.should.have.property("email")
                    res.body.should.have.property("phone")
                    res.body.should.not.have.property("password")
                    done();
                });
        });

        it("sign up user - internal error", (done) => {
            sinon.stub(userDao, "getUserByEmail").returns(null);
            sinon.stub(userDao, "signUp").returns(null);
            sinon.stub(service, "validateToken").returns(Promise.resolve(true));
            
            chai.request(app())
                .post('/api/authentication/user/signup')
                .set('content-type', 'application/x-www-form-urlencoded')
                .set('grant_type', 'password')
                .set('authorization', "Bearer "+oauth2StubValue["dataValues"]["access_token"])
                .send(userPayload)
                .end((err, res) => {
                    res.should.have.status(500);
                    res.text.should.be.equal("It was not able to sign up user")
                    done();
                });
        });

        it("sign up user - validation error", (done) => {
            sinon.stub(userDao, "getUserByEmail").returns(null);
            sinon.stub(userDao, "signUp").returns(null);
            sinon.stub(service, "validateToken").returns(Promise.resolve(true));
            userPayload.password = undefined;

            chai.request(app())
                .post('/api/authentication/user/signup')
                .set('content-type', 'application/x-www-form-urlencoded')
                .set('grant_type', 'password')
                .set('authorization', "Bearer "+oauth2StubValue["dataValues"]["access_token"])
                .send(userPayload)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.text.should.be.equal('{"errors":[{"msg":"Invalid value","param":"password","location":"body"}]}')
                    done();
                });
        });
    });
});