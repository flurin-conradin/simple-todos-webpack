import { Meteor } from 'meteor/meteor';
import _ from "lodash"

import {template as task} from './tasks.html';
import {Numbers, Tasks} from "../api/tasks"
window.taskInstances = [];

const doStuff = () => {
	task.onRendered(function taskCreated() {
		console.log("RenderedView Tasks and pushed");
		taskInstances.push(Template.instance())
	})
	task.onCreated(function taskCreated() {
		console.log("Created Tasks View");
		Meteor.subscribe('numbers');
	});

	task.helpers({
		isOwner() {
			return this.owner === Meteor.userId();
		},
		numbers() {
			let n = Numbers.find({});
			return n;
		},
		toConsole(stuff) {
			console.log('from html', stuff);
		}
	});


	task.events({
		'click .toggle-checked'() {
			console.log('toggle checked', this._id)
			// Set the checked property to the opposite of its current value
			Meteor.call('tasks.setChecked', this._id, !this.checked);
		},
		'click .delete'() {
			console.log('toggle remove')
			Meteor.call('tasks.remove', this._id);
		},
		'click .toggle-private'() {
			console.log('toggle private')
			Meteor.call('tasks.setPrivate', this._id, !this.private);
		},
	});
}

doStuff()

Template.task = task

if (module.hot) {
	const acceptFn = () => {
		doStuff()

		// console.log("The function was called", Tasks.find({}).count())
		// console.log("taskInstances", taskInstances)
		// Template.task.replaces("task");
		// let target = taskInstances[0].firstNode.parentNode
		let target = document.getElementById('tasks-ul')
		// Array.from(target.children).map((item) => item.remove())
		// let deepCopy = _.cloneDeep(taskInstances)
		// let parentView = _.cloneDeep(taskInstances[0].view.parentView)
		// $('#tasks-ul').empty()
		// const cursor = () => {
		// 	return Tasks.findOne({}, {sort: {createdAt: -1}});
		// }
		// let view = Blaze.With(cursor(), task)
		// Blaze.render(view, target)
		// Blaze.renderWithData(task, cursor(), target)
		taskInstances.map((inst, ind) => {
			// console.log("taskInstances before", taskInstances.length)
			Blaze.renderWithData(task, inst.data, target)
			setTimeout(() => {
				console.log("taskInstances after, popping", taskInstances.length)
				// taskInstances.pop()
			}, 500)
		})
		// console.log("The function was called after", Tasks.find({}).count())
		// taskInstances = deepCopy
		// setTimeout(
		// 	() => {
		// 		console.log("The function was called after", Tasks.find({}).count())
		// 		Blaze.render(tasksContainer, target);}
		// 	, 1000
		// )
	}
	module.hot.accept('./tasks.html', acceptFn );
}

