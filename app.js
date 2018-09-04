var express = require('express'),
    bodyParser = require('body-parser');
var app = express();

//setting up the server
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(__dirname + '/public'));
app.set("view engine","ejs");
app.use(bodyParser.json());

var name="",pass="";


//Creating array of objects
 var items = [
    {"Id": "1", "Name": "abc", "Parent": "2"},
    {"Id": "2", "Name": "abc", "Parent": ""},
    {"Id": "3", "Name": "abc", "Parent": "5"},
    {"Id": "4", "Name": "abc", "Parent": "2"},
    {"Id": "5", "Name": "abc", "Parent": ""},
    {"Id": "6", "Name": "abc", "Parent": "2"},
    {"Id": "7", "Name": "abc", "Parent": "6"},
    {"Id": "8", "Name": "abc", "Parent": "6"}
];

//storing in tree format
function buildHierarchy(arry) {

    var roots = [], children = {};

    // find the top level nodes and hash the children based on parent
    for (var i = 0, len = arry.length; i < len; ++i) {
        var item = arry[i],
            p = item.Parent,
            target = !p ? roots : (children[p] || (children[p] = []));

        target.push({ value: item });
    }

    // function to recursively build the tree
    var findChildren = function(parent) {
        if (children[parent.value.Id]) {
            parent.children = children[parent.value.Id];
            for (var i = 0, len = parent.children.length; i < len; ++i) {
                findChildren(parent.children[i]);
            }
        }
    };

    // enumerate through to handle the case where there are multiple roots
    for (var i = 0, len = roots.length; i < len; ++i) {
        findChildren(roots[i]);
    }

    return roots;
}


app.get("/",function(req,res){
    res.render("login");
});

//adding the new record to item array
app.post("/user",function(req,res){
    name = req.body.name,
    pass=req.body.password;
    console.log(name + ":" + pass);
    items.push(
        {
            "Id" : "10",
            "Name" : name ,
            "Parent": "2"
        }
        );
    res.redirect("/user");
});

app.get("/user",function(req,res){
    console.log(buildHierarchy(items));
    res.render("user",{name:name,items:items});
});

app.listen(3000,function(){
    console.log("Server Started on localhost:3000");
});