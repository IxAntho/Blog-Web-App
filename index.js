import express from "express";
import bodyParser from "body-parser";
// Import a library for generating unique IDs
import { v4 as uuidv4 } from "uuid";
import methodOverride from "method-override";

const app = express();
const port = 3000;
app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.get("/about", (req, res) => {
  res.render("about.ejs");
});

app.get("/newPost", (req, res) => {
  res.render("newPost.ejs");
});

// Post request for new posts
// Array to store posts
let posts = [];

app.post("/submit", (req, res) => {
  try {
    // Create a new Date object
    const currentDate = new Date();
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const month = monthNames[currentDate.getMonth()];
    const day = currentDate.getDate();
    const year = currentDate.getFullYear();
    const formattedDate = month + " " + day + ", " + year;

    // Get post data from request body
    const title = req.body.postTitle;
    const text = req.body.postText;
    const author = req.body.postAuthor;

    // Generate a unique ID for the post
    const postId = uuidv4();

    // Construct post object
    const newPost = {
      id: postId, // Assign the generated ID to the post object
      title: title,
      author: author,
      date: formattedDate,
      text: text,
    };

    // Add the new post object to the beginning of the posts array
    posts.unshift(newPost);

    console.log("Post submitted successfully");
    res.redirect("/"); // Redirect back to the home page
  } catch (err) {
    console.error("Error submitting post:", err);
    res.status(500).send("Error submitting post");
  }
});

app.get("/", (req, res) => {
  res.render("index.ejs", { posts });
});

app.get("/post/:id", (req, res) => {
  const postId = req.params.id;
  // Find the post with the corresponding ID in your posts array or database
  const post = posts.find((post) => post.id === postId);
  // Render the post.ejs file and pass the post data
  res.render("post.ejs", { post });
});

app.put("/post/:id", (req, res) => {
  const postId = req.params.id;
  // Find the index of the post in your array based on postId
  const index = posts.findIndex((post) => post.id === postId);
  if (index !== -1) {
    // Update the post with the new data from the request body
    posts[index].author = req.body.postAuthor;
    posts[index].title = req.body.postTitle;
    posts[index].text = req.body.postText;
    // Optionally, update other fields as needed

    // Redirect the user to the updated post page
    res.redirect(`/post/${postId}`);
  } else {
    // Handle error if post is not found
    res.status(404).send("Post not found");
  }
});

app.delete("/post/:id", (req, res) => {
  const postId = req.params.id;
  // Find the index of the post in your array based on postId
  const index = posts.findIndex((post) => post.id === postId);
  if (index !== -1) {
    // Remove the post from the array
    posts.splice(index, 1);
    res.redirect("/");
  } else {
    // Handle error if post is not found
    res.status(404).send("Post not found");
  }
});

app.get("/postEdit", (req, res) => {
  const postId = req.query.id; // Access post ID from query parameters
  // Find the post with the corresponding ID in your posts array or database
  const post = posts.find((post) => post.id === postId);
  res.render("postEdit.ejs", { post });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
