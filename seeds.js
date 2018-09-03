var mongoose = require("mongoose"),
	Blog     = require("./models/blogs"),
	Comment  = require("./models/comments");

var seedData = [
	{
		title: "First Post for the Test",
		description: "Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum "
	},
	{
		title: "Second Post for the Test",
		description: "Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum "
	},
	{
		title: "Third Post for the Test",
		description: "Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum "
	}
];


function seedDB(){
	Blog.remove({}, function(err, removedBlog) {
		if (err) {
			console.log(err);
		} else {
			console.log("All DB");
			seedData.forEach(function(seed) {
				Blog.create(seed, function(err, newPost) {
					if (err) {
						console.log(err);
					} else {
						console.log("New Post Created!");
						Comment.create({
							content: "This comment is the coolest thing since I have seen since sliced bread!",
							author: "Author J. Hawkwing"
						}, function(err, newComment) {
							if (err) {
								console.log(err);
							} else {
								newPost.comments.push(newComment);
								newPost.save();
								console.log("Comment Saved!!");
							}
						});
					}
				});
			});
		}
	});
}

module.exports = seedDB;