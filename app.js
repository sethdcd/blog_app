/*  Require NPM Packages
**************************************************/
const passportLocalMongoose = require("passport-local-mongoose"),
	  methodOverride        = require("method-override"),
	  LocalStrategy         = require("passport-local"),
	  bodyParser            = require("body-parser"),
	  passport              = require("passport"),
	  mongoose              = require("mongoose"),
	  express               = require("express"),
	  app                   = express();

/*  MongoDB Setup
**************************************************/
mongoose.connect("mongodb://localhost:27017/seth_blog_appv2", { useNewUrlParser: true });
const Comment = require("./models/comments"),
	  Blog    = require("./models/blogs"),
	  User    = require("./models/users"),
	  seedDB  = require("./seeds");

seedDB();

/*  Express Configuration
**************************************************/
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));

/*  Passport Setup
**************************************************/
app.use(require("express-session")({secret: 'keyboard noob', resave: false, saveUninitialized: false}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


/* User Routes
**************************************************/
app.get("/login", function(req, res) {
	res.render("login");
});


/* Blog Routes
**************************************************/
app.get("/", function(req, res) {
	res.redirect("/blog");
});

// Index Route
app.get("/blog", function(req, res) {
	Blog.find({}, function(err, postIndex) {
		if (err) {
			console.log(err);
		} else {
			res.render("blog/index", {blogs: postIndex});
		}
	});
	
});

// Add Route
app.get("/blog/new", function(req, res) {
	res.render("blog/new");
});

// Create Route
app.post("/blog", function(req, res) {
	Blog.create(req.body.blog, function(err, newPost) {
		if (err) {
			console.log(err);
		} else {
			console.log(newPost);
			res.redirect("/blog");
		}
	});
});

// Show Route
app.get("/blog/:id", function(req, res) {
	Blog.findById(req.params.id).populate("comments").exec(function(err, foundPost) {
		if (err) {
			console.log(err);
		} else {
			res.render("blog/show", {blog: foundPost});
		}
	});
});

// Edit Route
app.get("/blog/:id/edit", function(req, res) {
	Blog.findById(req.params.id, function(err, editPost) {
		if (err) {
			console.log(err);
		} else {
			res.render("blog/edit", {blog: editPost});
		}
	});
});

// Update Route
app.put("/blog/:id", function(req, res) {
	Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatePost) {
		if (err) {
			console.log(err);
			res.redirect("/blog/" + req.params.id + "/edit");
		} else {
			res.redirect("/blog/" + req.params.id);
		}
	});
});

// Delete Route
app.delete("/blog/:id", function(req, res) {
	Blog.findByIdAndRemove(req.params.id, function(err) {
		if (err) {
			console.log(err);
			res.redirect("/blog");
		} else {
			console.log('success');
			res.redirect("/blog");
		}
	})
});


/* Comment Routes
*****************************************************************************/
// Add Route
app.get("/blog/:id/comment/new", function(req, res) {
	Blog.findById(req.params.id, function(err, foundPost) {
		if (err) {
			console.log(err);
		} else {
			res.render("comment/new", {blog: foundPost});
		}
	});
});

// Create Route
app.post("/blog/:id/comment", function(req, res) {
	Blog.findById(req.params.id, function(err, foundPost) {
		if (err) {
			console.log(err);
		} else {
			Comment.create(req.body.comment, function(err, newComment) {
				if (err) {
					console.log(err);
				} else {
					foundPost.comments.push(newComment);
					foundPost.save();
					res.redirect("/blog/" + req.params.id);
				}
			});		
		}
	});
});

// App Listening
app.listen(3000, function() {
	console.log("Server Started!");
});