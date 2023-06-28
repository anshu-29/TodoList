const express = require("express")
const bodyParser = require ("body-parser")
const mongoose = require("mongoose");
const _ = require("lodash")



const app = express();
const items = [];
const workItems = [];

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static("public_1"))

mongoose.connect("mongodb+srv://aakansharora2909:yaadnhihai_1629@cluster0.btxjrss.mongodb.net/?retryWrites=true&w=majority//todolistDB",{useNewUrlParser : true})

const itemSchema = {
    name: String
};

const listSchema ={
    name : String,
    items: [itemSchema]
};



const Item = mongoose.model("Item", itemSchema);
const List = mongoose.model("List",listSchema);
const item1 = new Item( { name: "Welcome to your To-do-List" });
const item2 = new Item({ name: "Hit the + button to add a new item" });
const item3 = new Item({ name: "<-- Hit this to delete an Item" })


const defaultItems = [item1,item2,item3];


app.get("/", function (req, res) {
    async function findItemsInDB(){
        try{

            const findItems = await Item.find({})
            if (findItems.length === 0){
async function saveDefaultItemsToDB() {
    try {

        await Item.insertMany(defaultItems);

    } catch (err) {
        console.log(err);
        }
    }
    saveDefaultItemsToDB().then(r => {
    console.log("Successfully saved default items to DB");
});
                res.redirect("/");
            }
            else{
                res.render('list', {listTitle: "Today", newListItems: findItems});

            }
        } catch (err){
            console.log(err)
        }
    }
    findItemsInDB().then(r =>{
    })



});
app.post("/",function (req, res) {
const itemName = req.body.newItem;
const listName = req.body.list;
const item = new Item({
    name : itemName
})


if(listName === "Today"){
    item.save();
    res.redirect("/")
}else{
   async function findListName(){
       try{
           const findByName = await List.findOne({ name: listName });
           findByName.items.push(item);
           findByName.save();
           res.redirect("/" + listName)

       }catch (err) {
           console.log(err)
       }
   }
    findListName().then()
}


});




app.get('/:customListName', async (req, res) => {
    const customListName = _.capitalize(req.params.customListName);
    try {


        // Check if the customListName exists in the database
        const findByName = await List.findOne({ name: customListName });
        if (!findByName) {
            const list = new List({
                name: customListName,
                items: defaultItems
            })
             await list.save();
            res.redirect("/" + customListName)
        } else {
            res.render("list",{listTitle : await findByName.name, newListItems : findByName.items})
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred');
    }


});





app.post('/work',function (req,res) {
    const item = req.body.newItem;
    workItems.push(item);
    res.redirect("/work");

})

app.post("/delete", function (req, res) {
    async function deleteItems() {
        try {
            const checkedItemId = req.body.checkBox;
            const listName = req.body.listName;

            if(listName === "Today"){
                await Item.findByIdAndRemove(checkedItemId);
                console.log("Successfully deleted items");
                res.redirect("/")
            }
else{
    async function findAndUpdate(){
        try{
            await List.findOneAndUpdate({name: listName},{$pull:{items:{_id:checkedItemId}}})
        }catch (e) {
            console.log(e)
        }
    }
    findAndUpdate().then(r=> {
        res.redirect("/" + listName);
    })
            }

        } catch (err) {
            console.log(err);
        }
    }
    deleteItems().then(r => {

    });

});

app.get("/about",function (req,res) {
    res.render("about");


})
app.listen(3000,function () {
    console.log("Server started on port 3000");

})