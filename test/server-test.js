"use strict";

const assert = require('assert');
const request = require('request');
const app = require('../server');
const SurveyTracker = require('../lib/survey-tracker');

describe('Server', () => {
  var surveyData = { survey:
    { question: 'Which bear is best?',
      options: [ 'black', 'brown' ] }
  }

   // beforeEach(() => {
   //    app.locals.surveys = {};
   //  });

  before((done) => {
    this.port = 3000;

    this.server = app.listen(this.port, (err, result) => {
      if (err) { return done(err); }
      done();
    });

    this.request = request.defaults({
      baseUrl: 'http://localhost:3000/'
    });
  });

  it('should exist', () => {
    assert(app);
  });

  it('root should return a 200', (done) => {
    this.request.get('/', (error, response) => {
      if (error) { done(error); }
      assert.equal(response.statusCode, 200);
      done();
    });
  });

  describe('GET /', () => {

    it('root should return a 200', (done) => {
      this.request.get('/', (error, response) => {
        if (error) { done(error); }
        assert.equal(response.statusCode, 200);
        done();
      });
    });
  });

  describe('POST /admin', () => {

    xit('should not return 404', (done) => {
      console.log(surveyData)
      this.request.post('/admin', {survey: surveyData}, (error, response) => {
        if (error) { done(error); }
        assert.notEqual(response.statusCode, 404);
        done();
      });
    });

    xit('should receive and store data', (done) => {
      var validPizza = {
        pizza: {
          name: 'A vegan pizza',
          toppings: [ 'mushrooms', 'onions', 'garlic', 'black olives' ]
        }
      };

      this.request.post('/pizzas', { form: validPizza }, (error, response) => {
        if (error) { done(error); }

        var pizzaCount = Object.keys(app.locals.pizzas).length;

        assert.equal(pizzaCount, 1, `Expected 1 pizzas, found ${pizzaCount}`);

        done();
      });
    });

  });

});