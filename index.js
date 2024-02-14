import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));

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

    // Construct post object
    const newPost = {
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

// app.post("/submit", (req, res) => {
//   try {
//     // Create a new Date object
//     const currentDate = new Date();
//     const monthNames = [
//       "January",
//       "February",
//       "March",
//       "April",
//       "May",
//       "June",
//       "July",
//       "August",
//       "September",
//       "October",
//       "November",
//       "December",
//     ];
//     const month = monthNames[currentDate.getMonth()];
//     const day = currentDate.getDate();
//     const year = currentDate.getFullYear();
//     const formattedDate = month + " " + day + ", " + year;

//     // Get post data from request body
//     const title = req.body.postTitle;
//     const text = req.body.postText;
//     const author = req.body.postAuthor;

//     // Construct post HTML
//     const postHtml = `
//       <div class="post-preview">
//         <div class="post__link">
//           <h2 class="post-title post__title">${title}</h2>
//           <p class="post__author">- ${author}</p>
//           <div class="small text-muted post__date">${formattedDate}</div>
//         </div>
//       </div>
//       <hr class="my-4">
//     `;

//     // Add the new post to the beginning of the posts array
//     posts.unshift(postHtml);

//     console.log("Post submitted successfully");
//     res.redirect("/"); // Redirect back to the home page
//   } catch (err) {
//     console.error("Error submitting post:", err);
//     res.status(500).send("Error submitting post");
//   }
// });

app.get("/", (req, res) => {
  res.render("index.ejs", { posts });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
