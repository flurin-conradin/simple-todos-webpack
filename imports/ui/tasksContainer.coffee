import { Meteor } from 'meteor/meteor';
import { ReactiveDict } from 'meteor/reactive-dict';

import { Tasks } from '../api/tasks.coffee';

import './tasks.coffee'
import './tasksContainer.html';

Template.tasksContainer.onCreated ->
	@state = new ReactiveDict()
	Meteor.subscribe 'tasks'


Template.tasksContainer.helpers
	'tasks': ->
		instance = Template.instance()
		if instance.state.get 'hideCompleted'
			# If hide completed is checked, filter tasks
			return Tasks.find {checked: $ne: true}, sort: createdAt: -1
		Tasks.find {}, sort: createdAt: -1

	'incompleteCount': ->
		Tasks.find checked: $ne: true
			.count()
		
	'toConsole': (args...) ->
		console.log args[0...-1]...
		''

		
Template.tasksContainer.events
	'submit .new-task': (event) ->
		# Prevent default browser form submit
		event.preventDefault()

		#Get value from form element
		target = event.target
		text = target.text.value

		# Insert a task into the collection
		Meteor.call 'tasks.insert', text

		# Clear form
		target.text.value = '';
	
	'change .hide-completed input': (event, instance) ->
		instance.state.set 'hideCompleted', event.target.checked


target = document.getElementById "meteor-app"
Blaze.render Template.tasksContainer, target