const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");


const MONGO_URL = "mongodb://127.0.0.1:27017/wonderlust";

main()
.then(() => {
    console.log("Connected to DB");
}).catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

app.get("/" , (req, res) => {
    res.send("Hi, I am root");
});



//Index Route
app.get("/listings", async (req, res) => {
  try {
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching listings");
  }
});


//New Route
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});

//Create Route
app.post("/listings", async (req, res, next) => {
  try{
  const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
  }catch(err) {
    next(err);
  }
  });



//Show Route
app.get("/listings/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const listing = await Listing.findById(id.trim());
    if (!listing) return res.status(404).send("Listing not found");
    res.render("listings/show", { listing });
  } catch (err) {
    console.error(err);
    res.status(400).send("Invalid ID");
  }
});



// Edit Route
app.get("/listings/:id/edit", async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit", { listing });
});


// Update Route
app.put("/listings/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await Listing.findByIdAndUpdate(id.trim(), { ...req.body.listing });
        res.redirect(`/listings/${id}`);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error updating listing");
    }
});



// ✅ Delete Route
app.delete("/listings/:id", async (req, res) => {
    try {
        await Listing.findByIdAndDelete(req.params.id.trim());
        res.redirect("/listings");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error deleting listing");
    }
});

app.use((err, req, res, next) => {
  res.send("something went wronng!");
});

app.listen(8080, () => {
    console.log("Server is listening to port 8080");
});
