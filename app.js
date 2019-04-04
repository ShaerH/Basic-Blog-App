var express         = require("express"),
mongoose            = require("mongoose"),
bodyParser          = require("body-parser"),
app                 = express();

mongoose.connect('mongodb://localhost:27017/blog_app', { useNewUrlParser: true }); 
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
//Basic setup above ============================================================

//Mongoose/Model Config
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now()}
});
var Blog = mongoose.model("Blogs", blogSchema);

// Blog.create({
//   title: "Test Blog",
//   image: "https://images.unsplash.com/photo-1508780709619-79562169bc64?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
//   body: "This is a blog post if its not obvious"
// });

//RESTful Routes
app.get('/', function(req, res) {
   res.redirect('/blogs');
});

app.get("/blogs", function(req, res) {
    Blog.find({}, function(err, blogs){
       if(err){
           console.log("ERROR");
       } else {
           res.render('index', {blogs: blogs});
       }
    });
   
});

//New Route
app.get('/blogs/new', function(req, res) {
    res.render("new");
});

//Create Route
app.post('/blogs', function(req, res){
    var data = req.body.blog;
    Blog.create(data, function(err, newBlog){
        if(err){
            res.render("new");
        }else{
            res.redirect("/blogs");
        }
    });
});

//Show route
app.get("/blogs/:id", function(req, res) {
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs")
        }else{
            res.render("show", {blog: foundBlog});
        }
    });
});

//Edit route
app.get("/blogs/:id/edit", function(req, res) {
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.render("edit", {blog: foundBlog});
        }
    });
});

//Update route
app.put("/blogs/:id", function(req, res){
    var id = req.params.id;
    Blog.findByIdAndUpdate(id,req.body.blog,function(err, updatedBlog){
        if(err){
            res.redirect("/blogs");
        } else {
          res.redirect("/blogs/"+id);  
        }
    })
});

//Basic setup below ============================================================
app.get("*", function(req, res){
    res.send("Error page go back to code");
});
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Blog app has started!!");
});