import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Tasks = new Mongo.Collection('tasks');

// console.log("tasks api is run");


if (Meteor.isServer) {
	// This code only runs on the server
	Meteor.publish('tasks', function tasksPublication() {
		console.log("publishing tasks")
		return Tasks.find({
			$or: [
				{ private: { $ne: true } },
				{ owner: this.userId },
			],
		});
	});
}

export const Numbers = new Mongo.Collection('numbers');

// console.log("numbers is run");

if (Meteor.isServer) {
	// This code only runs on the server
	Meteor.publish('numbers', function numbersPublication() {
		console.log("publishing numbers")
		return Numbers.find({});
	});
}


Meteor.methods({
	'tasks.insert'(text) {
		console.log("some test some more stuff blibli blabla")
		check(text, String);

		// Make sure the user is logged in before inserting a task
		if (! Meteor.userId()) {
			throw new Meteor.Error('not-authorized');
		}

		Tasks.insert({
			text,
			createdAt: new Date(),
			owner: Meteor.userId(),
			username: Meteor.user().username,
		});
	},
	'tasks.remove'(taskId) {
		check(taskId, String);

		const task = Tasks.findOne(taskId);
		if (task.private && task.owner !== Meteor.userId()) {
			// If the task is private, make sure only the owner can delete it
			throw new Meteor.Error('not-authorized');
		}

		Tasks.remove(taskId);
	},
	'tasks.setChecked'(taskId, setChecked) {
		check(taskId, String);
		check(setChecked, Boolean);

		const task = Tasks.findOne(taskId);
		if (task.private && task.owner !== Meteor.userId()) {
			// If the task is private, make sure only the owner can check it off
			throw new Meteor.Error('not-authorized');
		}


		Tasks.update(taskId, { $set: { checked: setChecked } });
	},
	'tasks.setPrivate'(taskId, setToPrivate) {
		check(taskId, String);
		check(setToPrivate, Boolean);

		const task = Tasks.findOne(taskId);

		// Make sure only the task owner can make a task private
		if (task.owner !== Meteor.userId()) {
			throw new Meteor.Error('not-authorized');
		}

		Tasks.update(taskId, { $set: { private: setToPrivate } });
	},
});