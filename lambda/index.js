/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/
/**
 * This sample demonstrates a simple skill built with the Amazon Alexa Skills
 * nodejs skill development kit.
 * This sample supports multiple lauguages. (en-US, en-GB, de-DE).
 * The Intent Schema, Custom Slots and Sample Utterances for this skill, as well
 * as testing instructions are located at https://github.com/alexa/skill-sample-nodejs-fact
 **/

'use strict';
const Alexa = require('alexa-sdk');

const setlistfm = require('setlistfm-js');

const setlistfmClient = new setlistfm({
    key: "1f28f027-5c54-49f4-831f-6b71ecba6b93", // Insert your personal key here
    format: "json", // "json" or "xml", defaults to "json"
    language: "en" // defaults to "en"
});

//=========================================================================================================================================
//TODO: The items below this comment need your attention.
//=========================================================================================================================================

//Replace with your app ID (OPTIONAL).  You can find this value at the top of your skill's page on http://developer.amazon.com.
//Make sure to enclose your value in quotes, like this: const APP_ID = 'amzn1.ask.skill.bb4045e6-b3e8-4133-b650-72923c5980f1';
const APP_ID = 'amzn1.ask.skill.b2f764eb-4844-4f7c-9910-7f33573ac2c8';

const SKILL_NAME = 'Setlist';
const GET_FACT_MESSAGE = "Here's their setlist: ";
const HELP_MESSAGE = 'Ask something like "What is Nickelbacks setlist tonight?"';
const HELP_REPROMPT = 'What can I help you with?';
const STOP_MESSAGE = 'See ya later alligator!';

//=========================================================================================================================================
//TODO: Replace this data with your own.  You can find translations of this data at http://github.com/alexa/skill-sample-node-js-fact/data
//=========================================================================================================================================
const data = [
    'Burn the Disco Floor with Your 2-step', 
    'Play Video',
    'Greedy',
    'Play Video',
    'Return to Zero',
    'Play Video',
    'Treasure in Your Hands',
    'Play Video',
    'LLLD'
];



//=========================================================================================================================================
//Editing anything below this line might break your skill.
//=========================================================================================================================================

const handlers = {
    'LaunchRequest': function () {
        this.emit('GetNewFactIntent');
    },
    'GetSetlistIntent': function () {

        setlistfmClient.searchSetlists({
            artistName: this.event.request.intent.slots.band.value
        }).then(setlists => {
            console.log('---- setlists: ', setlists);
            const songs = setlists.setlist[6].sets.set[0].song;
            const formattedSongs = songs.reduce((songs, song) => {
                return songs + ", " + song.name;
            }, "");

            const speechOutput = `This is ${this.event.request.intent.slots.band.value}'s setlist: ${formattedSongs}`;
            this.response.cardRenderer(SKILL_NAME, speechOutput);
            this.response._responseObject.response.outputSpeech = {
                type: 'PlainText',
                text: speechOutput
            };
            // this.response.text(speechOutput);
            this.emit(':responseReady');
        });

    },
    'AMAZON.HelpIntent': function () {
        const speechOutput = HELP_MESSAGE;
        const reprompt = HELP_REPROMPT;

        this.response.speak(speechOutput).listen(reprompt);
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent': function () {
        this.response.speak(STOP_MESSAGE);
        this.emit(':responseReady');
    },
    'AMAZON.StopIntent': function () {
        this.response.speak(STOP_MESSAGE);
        this.emit(':responseReady');
    },
};

exports.handler = function (event, context, callback) {
    const alexa = Alexa.handler(event, context, callback);
    alexa.APP_ID = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};
