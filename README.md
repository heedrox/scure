# SCURE - Script Creation Utilities for Ric Escape (Conversational adventures).

SCURE is a javascript engine for creating conversational or adventure games. 

It sets its focus on the workflow of the game. No graphics or input handling, just maintains the state on the game
based on the actions that the user does.

It's perfect for games based on text only or voice only input, like Google Assistant games or console text games.

## Usage

Check https://github.com/jmarti-theinit/ric-escape to see an example.

- Create a data.js
- Handle input and use scure* commands.

## Instalation

npm install --save scure

## Instructions and commands

- require('scure').buildScureFor (data) : builds scure object that is used to parse data JSON.
- require('scure').dsl : functions to build the data JSON.
- require('scure').commands : scure* functions to execute over the data JSON and the user input.
- require('scure').lib : helper functions (as stateIsUnlocked) to be used on your app.

