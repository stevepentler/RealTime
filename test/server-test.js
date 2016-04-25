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
      this.port = 9876;

      this.server = app.listen(this.port, (err, result) => {
        if (err) { return done(err); }
        done();
      });

      this.request = request.defaults({
        baseUrl: 'http://localhost:9876/'
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
        var surveyCount = Object.keys(app.locals.surveys).length;
        assert.equal(surveyCount, 1, `Expected 1 survey, found ${surveyCount}`);
        done();
      });
    });

    it('should return the proper survey for admin', (done) => {
      this.request.post('/admin', { form: surveyData }, (error, response) => {
        if (error) { done(error); }

        var surveyId = Object.keys(app.locals.surveys)[0];
        var survey = app.locals.surveys[surveyId]

        this.request.get(`/surveys/${survey.id}`, (error, response) => {
          if (error) { done(error); }
          assert(response.body.includes(survey.question),
          `"${response.body}" does not include "${survey.question}".`);
          done();
        });
      });
    });

  });

})