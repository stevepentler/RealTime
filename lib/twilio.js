"use strict";

const twilio = require('twilio');
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

function sendText(message) {
    client.sms.messages.create({
        to: '+12624421086',
        from: '+12627102136',
        body:`Your survey has closed! Here are the results: ${message}`
    }, function(error, message) {
        if (!error) {
            console.log('Success! The SID for this SMS message is:');
            console.log(message.sid);

            console.log('Message sent on:');
            console.log(message.dateCreated);
        } else {
            console.log('Oops! There was an error.');
        }
    });
};

module.exports = sendText;