console.log(process.env.MONGODB_URI)

//___________________
//Dependencies
//___________________
const express = require('express');
const methodOverride  = require('method-override');
const mongoose = require ('mongoose');
const app = express ();
const db = mongoose.connection;
const Thing = require('./models/things.js');
//___________________
//Port
//___________________
// Allow use of Heroku's port or your own local port, depending on the environment
const PORT = process.env.PORT || 3000;

//___________________
//Database
//___________________
// How to connect to the database either via heroku or locally
const MONGODB_URI = process.env.MONGODB_URI;

// Fix Depreciation Warnings from Mongoose*
// May or may not need these depending on your Mongoose version
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

// Connect to Mongo
mongoose.connect(MONGODB_URI ,  { useNewUrlParser: true});

// Error / success
db.on('error', (err) => console.log(err.message + ' is Mongod not running?'));
db.on('connected', () => console.log('mongo connected: ', MONGODB_URI));
db.on('disconnected', () => console.log('mongo disconnected'));

//___________________
//Middleware
//___________________

//use public folder for static assets
app.use(express.static('public'));

// populates req.body with parsed info from forms - if no data from forms will return an empty object {}
app.use(express.urlencoded({ extended: false }));// extended: false - does not allow nested objects in query strings
app.use(express.json());// returns middleware that only parses JSON - may or may not need it depending on your project

//use method override
app.use(methodOverride('_method'));// allow POST, PUT and DELETE from a form


//___________________
// Routes

//NEW ROUTE
app.get('/things/new', (req, res)=>{
    res.render('new.ejs');
});

//SHOW
app.get('/things/:id', (req, res)=>{
    Thing.findById(req.params.id, (err, foundThing)=>{
        res.render('show.ejs', {
            thing:foundThing
        });
    });
});

app.post('/things/', (req, res)=>{
  Thing.create(req.body, (error, createdThing)=>{
     res.redirect('/things');
  });
});

//INDEX
app.get('/things', (req, res)=>{
    Thing.find({}, (error, allThing)=>{
        res.render('index.ejs', {
            thing: allThing//this must be inside the brackets for it to be called
        });
    });
});

//EDIT
app.get('/things/:id/edit', (req, res)=>{
    Thing.findById(req.params.id, (err, foundThing)=>{ //find the bean
        res.render(
    		'edit.ejs',
    		{
    			thing: foundThing //pass in found bean
    		}
    	);
    });
});

app.put('/things/:id', (req, res)=>{
    Thing.findByIdAndUpdate(req.params.id, req.body, {new:true}, (err, updatedModel)=>{
        res.redirect('/things');
    });
});

//DELETE
app.delete('/things/:id', (req, res)=>{
  Thing.findByIdAndRemove(req.params.id, (err, found)=>{
      res.redirect('/things');//redirect back to beans index
  });
});

///BUY

app.put('/things/:id/like', (req, res)=>{
    Thing.findByIdAndUpdate(req.params.id, req.like, {new:true}, (err, updatedThing)=>{
        updatedThing.like += 1;
        updatedThing.save();
        res.redirect('/things/' + req.params.id);
    });
});

//___________________
//Listener
//___________________
app.listen(PORT, () => console.log( 'Listening on port:', PORT));
