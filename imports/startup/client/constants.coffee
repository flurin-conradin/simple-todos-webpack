moment = require('moment')
CONST = {}

exports.CONST = @CONST = CONST

CONST.getJanuaryFirst = ->
	moment('2020-01-01').toDate()
	
