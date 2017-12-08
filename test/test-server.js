var chai = require('chai');
var chaiHttp = require('chai-http');
var app = require('../app.js');
var should = chai.should();
var expect = chai.expect;
var cheerio = require('cheerio');

var config = require('../knexfile')[process.env.NODE_ENV || "development"];
var knex = require("knex")(config);

chai.use(chaiHttp);

// Function for before and after each test rollback migrations and run seed file again
var reset = function (done) {
    knex.migrate.rollback()
        .then(function () {
            knex.migrate.latest()
                .then(function () {
                    return knex.seed.run()
                        .then(function () {
                            done();
                        })
                })
        })
};

describe('Posts', function () {
    // Before each test we rollback the migrations and run the seed file again
    beforeEach(reset);
    afterEach(reset);

    it('should list ALL posts on /posts GET', function (done) {
        chai.request(app)
            .get('/posts')
            .end(function (err, res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('array');
                res.body.should.have.length(8);
                res.body[0].should.have.property('description');
                res.body[0].description.should.equal('I love that amazing food');
                done();
            });
    });

    it('should list a SINGLE post on /post/:id GET', function (done) {
        chai.request(app)
            .get('/posts/7')
            .end(function (err, res) {
                // For illustartion purposes different style using expect. Should and expect are both fine
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.a('object');
                expect(res.body).to.have.property('description');
                expect(res.body.description).to.equal('I am the boss');
                // Add associations for post belongs to user
                expect(res.body).to.have.property('user');
                expect(res.body.user).to.be.a('object');
                expect(res.body.user).to.have.property('name');
                expect(res.body.user.name).to.equal('howie mann');
                expect(res.body.user).to.have.property('email');
                expect(res.body.user.email).to.equal('howie@email.com');
                done();
            });
    });

    it('should add a SINGLE post on /posts POST', function (done) {
        chai.request(app)
            .post('/posts')
            .send({
                description: 'This is a new post',
                user_id: 5
            })
            .end(function (err, res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('description');
                res.body.description.should.equal('This is a new post');
                res.body.should.have.property('user');
                res.body.user.should.be.a('object');
                res.body.user.should.have.property('name');
                res.body.user.name.should.equal('howie mann');
                done();
            });
    });

    it('should update a SINGLE post on /posts/:id PUT', function (done) {
        chai.request(app)
            .put('/posts/1')
            .send({
                description: 'I love gravy'
            })
            .end(function (err, res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('description');
                res.body.description.should.equal('I love gravy');
                done();
            });
    });

    it('should delete a SINGLE post on /posts/:id DELETE', function (done) {
        chai.request(app)
            .delete('/posts/5')
            .end(function (err, res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('description');
                res.body.description.should.equal('Cheese is good on anything');
                chai.request(app)
                    .get('/posts')
                    .end(function (err, res) {
                        res.should.have.status(200);
                        res.should.be.json;
                        res.body.should.be.a('array');
                        res.body.length.should.equal(7);
                        done();
                    });
            });
    });
});

describe('Users', function () {
    beforeEach(reset);
    afterEach(reset);

    it('should list ALL users on /users GET', function (done) {
        chai.request(app)
            .get('/users')
            .end(function (err, res) {
                // Load html for jQuery selecting using cheerio
                var $ = cheerio.load(res.text);
                var $main = $('#main');
                var $users = $('.user');

                res.should.have.status(200);
                res.should.be.html;
                ($main.find('h3').text()).should.equal('Users Index page');
                ($users.length).should.equal(6);
                ($users.eq(0).text()).should.include('polly paddle');
                ($users.eq(0).find('.show-user').attr('href')).should.include('/users/2');
                ($users.eq(0).find('.edit-user').attr('href')).should.include('/users/2/edit');
                done();
            });
    });

    it('should list a SINGLE user on /users/:id GET', function (done) {
        chai.request(app)
            .get('/users/1')
            .end(function (err, res) {
                var $ = cheerio.load(res.text);
                var $main = $('#main');

                res.should.have.status(200);
                res.should.be.html;
                ($main.find('h3').text()).should.equal('john smith');
                ($main.find('.new-post').attr('href')).should.equal('/users/1/posts/new');
                done();
            });
    });

    it('should display a NEW user view page on /users/new GET', function (done) {
        chai.request(app)
            .get('/users/new')
            .end(function (err, res) {
                var $ = cheerio.load(res.text);
                var $main = $('#main');
                res.should.have.status(200);
                res.should.be.html;
                ($main.find('h3').text()).should.equal('Create new User');
                done();
            });
    });

    it('should add a SINGLE user on /users POST', function (done) {
        chai.request(app)
            .post('/users')
            .send({
                name: 'Max Payne',
                email: 'max@email.com',
                age: 40
            })
            .end(function (err, res) {
                var $ = cheerio.load(res.text);
                var $main = $('#main');
                res.should.have.status(200);
                res.should.be.html;
                ($main.text()).should.include('Max Payne');
                ($main.find('.user').length).should.equal(7);
                done();
            });
    });

    it('should display a EDIT user view page on /users/:id/edit GET', function (done) {
        chai.request(app)
            .get('/users/1/edit')
            .end(function (err, res) {
                var $ = cheerio.load(res.text);
                var $main = $('#main');
                res.should.have.status(200);
                res.should.be.html;
                ($main.find('h3').text()).should.equal('Edit john smith');
                done();
            });
    });

    it('should update a SINGLE user on /users/:id PUT', function (done) {
        chai.request(app)
            .put('/users/1')
            .send({
                name: 'johnny smith'
            })
            .end(function (err, res) {
                var $ = cheerio.load(res.text);
                var $main = $('#main');
                res.should.have.status(200);
                res.should.be.html;
                ($main.find('h3').text()).should.equal('johnny smith');
                done();
            });
    });

    it('should delete a SINGLE user on /users/:id DELETE', function (done) {
        chai.request(app)
            .delete('/users/1')
            .end(function (err, res) {
                var $ = cheerio.load(res.text);
                var $main = $('#main');
                res.should.have.status(200);
                res.should.be.html;
                ($main.find('.user').length).should.equal(5);
                done();
            });
    });

});

describe('Users Posts', function () {
    beforeEach(reset);
    afterEach(reset);

    it('should display a NEW post page for a user on /users/:id/posts/new', function (done) {
        chai.request(app)
            .get('/users/1/posts/new')
            .end(function (err, res) {
                var $ = cheerio.load(res.text);
                var $main = $('#main');
                res.should.have.status(200);
                res.should.be.html;
                ($main.find('h3').text()).should.equal('New post for john smith');
                done();
            });
    });

    it('should add a SINGLE post for a given user on /users/:id/posts', function (done) {
        chai.request(app)
            .post('/users/1/posts')
            .send({
                description: 'glory to the king'
            })
            .end(function (err, res) {
                var $ = cheerio.load(res.text);
                var $main = $('#main');
                res.should.have.status(200);
                res.should.be.html;
                ($main.find('.user-posts').text()).should.include('glory to the king');
                done();
            });

    });
});
