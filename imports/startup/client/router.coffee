import '../../ui/tasksContainer.coffee';
import '../../ui/games.coffee';

Router.route '/', ->
	@render 'tasksContainer'


Router.route '/games', ->
	@render 'games'

