// import {Mongo} from "meteor/mongo"
// import {Meteor} from "meteor/meteor"
//
// export const Numbers = new Mongo.Collection('numbers');
//
// // console.log("numbers is run");
//
// if (Meteor.isServer) {
// 	// This code only runs on the server
// 	console.log("publishing numbers")
// 	Meteor.publish('numbers', function numbersPublication() {
// 		return Numbers.find({});
// 	});
// }