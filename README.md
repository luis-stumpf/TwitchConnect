# TwitchConnect

This is a website that provides a way to connect with other streamers and make friend

## Services provided

- authenticate with your Twitch Account
- find people who are searching for stream partners
- contact peoples you think it would be fun to stream with
- post which people you are looking searching for
- find new streamer buddies you can grow together with

## NPM packages

- body-parser
- dotenv
- ejs
- express
- express-session
- mongoose
- mongoose-findorcreate
- passport
- passport-local-mongoose
- passport-twitch-new
- path

## Database informations

- the application uses an mongoDB data base running in a Docker container
- Data is stored in two tables
  - users
  - posts
- The user Table has got fields (except of the standart mongoDB fields)

  1.  twitchId (by Twitch provided username)
  1.  displayName (String of the on Twitch displayed username)
  1.  prifileImage (link to the Twitch profile image)
  1.  email (email used on the Twitch account)

- The posts table has got six fields (except of the standart mongoDB fields)
  1.  title (title of the created post)
  1.  content (content of the created post)
  1.  writer (the username that is used to log in on Twitch)
  1.  writerImg (link to the Twitch profile image of the user who created the post)
  1.  writerEmail (email of the user who created the post)
  1.  time (stores the time when the post was created)

### I am just trying to improve my coding skills :) O_o 🙃 contact me if you have suggestions for improvement

---

## Build by Luis Stumpf
