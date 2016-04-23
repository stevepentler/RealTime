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

    after(() => {
      this.server.close();
    });

  it('should exist', () => {
    assert(app);
  });

  describe('GET /', () => {

    it('should return a 200 for home page', (done) => {
      this.request.get('/', (error, response) => {
        if (error) { done(error); }
        assert.equal(response.statusCode, 200);
        done();
      });
    });

    xit('should have a body with the name of the application', (done) => {
      // var title = app.locals.title;

      this.request.get('/', (error, response) => {
        if (error) { done(error); }
        assert(response.body.includes(title),
               `"${response.body}" does not include "${title}".`);
        done();
      });
    });
  });

  describe('POST /admin', () => {
    beforeEach(() => {
      app.locals.surveys = {};
    });

    it('should not return 404', (done) => {
      this.request.post('/admin', { form: surveyData }, (error, response) => {
        if (error) { done(error); }
        assert.notEqual(response.statusCode, 404);
        done();
      });
    });

    it('should receive a survey and store it', (done) => {
      app.locals.surveys = {};
      this.request.post('/admin', { form: surveyData }, (error, response) => {
        if (error) { done(error); }

        var surveyCount = Object.keys(surveys).length;
        assert.equal(surveyCount, 1, `Expected 1 survey, found ${surveyCount}`);
        done();
      });
    });

    it('should redirect the user to the admin results page', (done) => {
      var payload = { survey: surveyData};

      this.request.post('/admin', { form: payload }, (error, response) => {
        if (error) { done(error); }
        var newSurveyId = Object.keys(app.locals.surveys)[0];
        assert.equal(response.headers.location, '/admin/' + newSurveyId);
        done();
      });
    });
  });
})