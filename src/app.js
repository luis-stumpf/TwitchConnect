const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const twitchStrategy = require('passport-twitch-new').Strategy;
const findOrCreate = require('mongoose-findorcreate');

const Post = require('../src/modules/postSchema');
const loggedIn = require('../src/modules/loggedIn');

const path = require('path');
const { profile } = require('console');
const { RSA_NO_PADDING } = require('constants');

require('dotenv').config({
	path: path.join(__dirname, '.env'),
});

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

// using sessions
app.use(
	session({
		secret: process.env.SECRET_KEY,
		resave: false,
		saveUninitialized: false,
	})
);

// initialize passport
app.use(passport.initialize());
app.use(passport.session());

// connect to database in docker
mongoose.connect('mongodb://localhost:2717/userDB', {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});
mongoose.set('useCreateIndex', true);

const userSchema = new mongoose.Schema({
	email: String,
	password: String,
	twitchId: String,
	displayName: String,
	profileImage: String,
	email: String,
	secret: String,
});

userSchema.plugin(findOrCreate);

const User = new mongoose.model('User', userSchema);

// using Twitch OAuth
passport.serializeUser(function (user, done) {
	done(null, user.id);
});

passport.deserializeUser(function (id, done) {
	User.findById(id, function (err, user) {
		done(err, user);
	});
});

passport.use(
	new twitchStrategy(
		{
			clientID: process.env.TWITCH_CLIENT_ID,
			clientSecret: process.env.TWITCH_CLIENT_SECRET,
			callbackURL: 'http://localhost:3001/auth/twitch/callback/',
			scope: 'user_read',
		},
		function (accessToken, refreshToken, profile, done) {
			User.findOrCreate(
				{
					twitchId: profile.id,
					displayName: profile.display_name,
					profileImage: profile.profile_image_url,
					email: profile.email,
				},
				function (err, user) {
					return done(err, user);
				}
			);
		}
	)
);

// rendering pages
app.get('/auth/twitch', passport.authenticate('twitch'));

app.get(
	'/auth/twitch/callback',
	passport.authenticate('twitch', { failureRedirect: '/' }),
	function (req, res) {
		// authenticated
		res.redirect('/');
	}
);

// rendering home-page
app.get('/', loggedIn, (req, res) => {
	Post.find({}, function (err, posts) {
		res.render('home', {
			userName: req.user,
			posts: posts,
		});
	});
});

// rendering posts
app.get('/posts', loggedIn, function (req, res) {
	Post.find({}, function (err, posts) {
		res.render('posts', {
			userName: req.user,
			posts: posts,
		});
	});
});

// rendering login-page
app.get('/login', loggedIn, (req, res) => {
	res.render('login', {
		userName: req.user,
	});
});

// rendering compose-page
app.get('/compose', loggedIn, (req, res) => {
	if (req.isAuthenticated()) {
		res.render('compose', {
			userName: req.user,
		});
	} else {
		res.redirect('/login');
	}
});

// fetching data form compose-page
app.post('/compose', function (req, res) {
	const post = new Post({
		title: req.body.postTitle,
		content: req.body.postBody,
		writer: req.user.displayName,
		writerImg: req.user.profileImage,
		writerEmail: req.user.email,
		time: new Date().toLocaleString(),
	});
	post.save(function (err) {
		if (!err) {
			res.redirect('/');
		}
	});
});

// starting server
app.listen(3001, () => {
	console.log('Server started on port 3001');
});
