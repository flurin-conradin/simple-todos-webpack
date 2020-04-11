import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export Tasks = new Mongo.Collection('tasks');

if Meteor.isServer
	# This code only runs on the server
	Meteor.publish 'tasks', ->
		Tasks.find
			$or: [
				{private: $ne: true}
				{owner: @userId}
			]


Meteor.methods
	'tasks.insert': (text) ->
		check(text, String);

		# Make sure the user is logged in before inserting a task
		unless Meteor.userId()
			throw new Meteor.Error 'not-authorized'

		Tasks.insert
			text: text
			createdAt: new Date()
			owner: Meteor.userId()
			username: Meteor.user().username
		
	'tasks.remove': (taskId) ->
		check taskId, String

		task = Tasks.findOne(taskId)
		
		if task.private and task.owner isnt Meteor.userId()
			# If the task is private, make sure only the owner can delete it
			throw new Meteor.Error 'not-authorized'

		Tasks.remove taskId
		
	'tasks.setChecked': (taskId, setChecked) ->
		check taskId, String
		check setChecked, Boolean

		task = Tasks.findOne taskId
		if task.private and task.owner isnt Meteor.userId()
			# If the task is private, make sure only the owner can check it off
			throw new Meteor.Error 'not-authorized'

		Tasks.update taskId, $set: checked: setChecked

	'tasks.setPrivate': (taskId, setToPrivate) ->
		check taskId, String
		check setToPrivate, Boolean

		task = Tasks.findOne taskId
		
		# Make sure only the task owner can make a task private
		if task.owner isnt Meteor.userId()
			throw new Meteor.Error('not-authorized')


		Tasks.update taskId, $set: private: setToPrivate
