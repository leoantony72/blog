const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./database");

//middlewares
app.use(cors());
app.use(express.json());

//routes

//GET ALL POSTS
app.get("/posts", async (req, res) => {
  try {
    const allTodos = await pool.query("SELECT * FROM post ORDER BY post_id");
    res.json(allTodos.rows);
  } catch (err) {
    console.error(err.message);
  }
});

//GET A POST BY IT'S ID
app.get("/post/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const allTodos = await pool.query(
      "SELECT * FROM post JOIN authors ON post.author_id = authors.id JOIN post_category ON post_category.post_id = post.post_id JOIN category ON category.id = post_category.category_id WHERE post.post_id = $1",
      [id]
    );
    res.json(allTodos.rows);
  } catch (err) {
    console.error(err.message);
  }
});

//GET POSTS IN A CATEGORY
app.get("/posts/:category", async (req, res) => {
  try {
    const { category } = req.params;
    const allPost = await pool.query(
      "SELECT * FROM post JOIN authors ON post.author_id = authors.id JOIN post_category ON post_category.post_id = post.post_id JOIN category ON category.id = post_category.category_id WHERE category.title = $1",
      [category]
    );
    res.json(allPost.rows);
  } catch (err) {
    console.error(err.message);
  }
});

//CREATE A POST
app.post("/newpost", async (req, res) => {
  const client = await pool.connect()
  try {
    const {
      post_title,
      post_meta_title,
      post_slug,
      post_summary,
      post_content,
      post_published,
      author_id,
      category_id
    } = req.body;
    const now = new Date()
    const newpost = await pool.query(
      "INSERT INTO post (title,meta_title,slug,summary,content,published,publishedAt,author_id) VALUES($1,$2,$3,$4,$5,$6,$7,$8) RETURNING post_id",
      [
        post_title,
        post_meta_title,
        post_slug,
        post_summary,
        post_content,
        post_published,
        now,
        author_id,
      ]
    );
    res.json(newpost.rows[0])

    const newcat = pool.query("INSERT INTO post_category(post_id,category_id) VALUES($1,$2)",[
      newpost.rows[0].post_id,
      category_id
    ]);
    const sucess = await console.log("Worked");
  } catch (err) {
    console.error(err)
  }
})




//App listen
app.listen(3000, () => {
  console.log("server started ");
});
