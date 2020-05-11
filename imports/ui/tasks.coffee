import { Meteor } from 'meteor/meteor';

import '/imports/ui/tasks.html';


Template.task.helpers
	isOwner: () ->
		@owner is Meteor.userId()


Template.task.events
	'click .toggle-checked': () ->
		# Set the checked property to the opposite of its current value
		Meteor.call 'tasks.setChecked', this._id, !this.checked
	
	'click .delete': () ->
		Meteor.call 'tasks.remove', this._id
	
	'click .toggle-private': () ->
		Meteor.call 'tasks.setPrivate', this._id, !this.private
	
	'click .text': (event, instance) ->
		target = instance.firstNode.parentNode
		Blaze.renderWithData(Template.task, instance.data, target)

