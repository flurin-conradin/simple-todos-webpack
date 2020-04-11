import { Meteor } from 'meteor/meteor';
import { ReactiveDict } from 'meteor/reactive-dict';

import { Tasks } from '../api/tasks.js';

import './tasks.js'
import {template as tasksContainer} from './tasksContainer.html';
let i;

let doStuff = () => {
	tasksContainer.onCreated(function bodyOnCreated() {
		// window.tasksContainerInstance = Template.instance()
		console.log('pushing instance')
		i = Template.instance()
		this.state = new ReactiveDict();
		// console.log("onCreated taskContainer", Tasks.find({}).count())
		Meteor.subscribe('tasks');
		this.number = new ReactiveVar(0)
	});

	tasksContainer.helpers({
		tasks() {
			const instance = Template.instance();
			if (instance.state.get('hideCompleted')) {
				// If hide completed is checked, filter tasks
				return Tasks.find({checked: {$ne: true}}, {sort: {createdAt: -1}});
			}
			return Tasks.find({}, {sort: {createdAt: -1}});
		},
		// oneTask() {
		// 	let rv =  Tasks.findOne({});
		// 	console.log("the task", rv)
		// 	return rv
		// },
		incompleteCount() {
			return Tasks.find({checked: {$ne: true}}).count();
		},
		numberGet() {
			const instance = Template.instance();
			return instance.number.get()
		},
		toConsole(stuff) {
			console.log('from html', stuff);
		}
	});

	tasksContainer.events({
		'submit .new-task'(event) {
			// Prevent default browser form submit
			event.preventDefault();

			// Get value from form element
			const target = event.target;
			const text = target.text.value;

			// Insert a task into the collection
			Meteor.call('tasks.insert', text);

			// Clear form
			target.text.value = '';
		},
		'change .hide-completed input'(event, instance) {
			instance.state.set('hideCompleted', event.target.checked);
		},
	});
}

doStuff()

let target = document.getElementById( "meteor-app" );
// console.log('before tasksContainer render')
Blaze.render(tasksContainer, target);

if (module.hot) {
	const getAcceptFunction = (template) => {
		// console.log('getAcceptFunction called')
		return () => {
			doStuff()
			let target = i.firstNode.parentNode
			Blaze.remove(i.view);
			console.log("number of tasks", Tasks.find({}).count())
			// This setTimeout is just to have visual feedback when Template is rendered from
			// within hot functionality
			setTimeout(
				() => {
					// console.log("The function was called after", Tasks.find({}).count())
					console.log("number of tasks", Tasks.find({}).count())
					Blaze.render(tasksContainer, target);}
				, 1000
			)
			// delete Template['tasksContainer']
			// console.log("Flurin After", Template['tasksContainer'])
		}
	}
	// console.log("before acceptFn", tasksContainer)
	let acceptFn = getAcceptFunction(tasksContainer)
	let acceptFn2 = () => {console.log("accepted tasks in taskContainer")}
	module.hot.accept('./tasksContainer.html', acceptFn );
	// module.hot.accept('./tasks.js', acceptFn2 );
}