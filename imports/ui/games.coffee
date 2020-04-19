import './games.html'
moment = require 'moment'
_ = require 'lodash'
{CONST} = require '../startup/client/constants.coffee'
Template.games.helpers
	games: ->
		[
			_.extend {name: 'Zelda'}, {time: moment().toDate()}
			_.extend {name: 'Super Maria'}, {time: CONST.getJanuaryFirst()}
		]