import '../../ui/tasksContainer.coffee';
import '../../ui/games.coffee';
import '../../ui/dummy.html'

Router.route '/', ->
	@render 'tasksContainer'


Router.route '/games', ->
	@render 'games'

Router.route '/dummy', ->
	@render 'dummy'
