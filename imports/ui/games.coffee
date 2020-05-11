import './games.html'
moment = require 'moment'
_ = require 'lodash'
{CONST} = require '../startup/client/constants.coffee'

provision = () =>
	Template.games.helpers
		games: ->
			[
				_.extend {name: 'Zelda'}, {time: moment().toDate()}
				_.extend {name: 'Super Maria'}, {time: CONST.getJanuaryFirst()}
			]

if module.hot
	refresh = =>
		if Router.current()?.route.path() is '/games'
			Router.go '/dummy'
			setTimeout => Router.go '/games'
	
	htmlHMR = =>
		provision()
		refresh()
	
	selfHMR = =>
#		Not necessary as there are no events or hooks
#		Template.games.__eventMaps = []
#		Template.games._callbacks = {created:[], rendered:[], destroyed:[]}
		provision()
		refresh()
	
	console.log "accepting self"
	selfHMR()
	
	module.hot.accept './tasksContainer.html', htmlHMR
	module.hot.accept()
else
	provision()