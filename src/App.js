import { useEffect, useState } from "react";
import "./style.css";
import supabase from "./supabase";

import Comments from "./Comments";

const INITIAL_CATEGORIES = [
  { name: "technology", color: "#3b82f6" },
  { name: "science", color: "#16a34a" },
  { name: "finance", color: "#ef4444" },
  { name: "society", color: "#eab308" },
  { name: "entertainment", color: "#db2777" },
  { name: "health", color: "#14b8a6" },
  { name: "history", color: "#f97316" },
  { name: "news", color: "#8b5cf6" },
];

function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function App() {
  const [showForm, setShowForm] = useState(false);
  const [facts, setFacts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCategory, setCurrentCategory] = useState("all");
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);

  const addCategory = (category) => {
    setCategories((categories) => [...categories, category]);
  };

  useEffect(
    function () {
      async function getFacts() {
        setIsLoading(true);

        let query = supabase.from("facts").select("*");

        if (currentCategory !== "all") {
          query = query
            .eq("category", currentCategory)
            .order("votesInteresting", { ascending: false })
            .limit(1000);
        }
        let { data: facts, error } = await query;
        if (!error) setFacts(facts);
        else alert("There was a problem fetching data");
        setIsLoading(false);
        console.log(error);
      }
      getFacts();
    },
    [currentCategory]
  );

  return (
    <>
      <Header showForm={showForm} setShowForm={setShowForm} />
      {showForm ? (
        <NewFactForm setFacts={setFacts} setShowForm={setShowForm} addCategory={addCategory} categories={categories} />
      ) : null}
      <main className="main">
        <CategoryFilter setCurrentCategory={setCurrentCategory} categories={categories} />
        {isLoading ? <Loader /> : <FactList facts={facts} setFacts={setFacts} categories={categories} />}
      </main>
    </>
  );
}

function Header({ showForm, setShowForm }) {
  return (
    <header className="header">
      <div className="logo">
        <img src="logo.png" height="68" width="68" alt="Today I Learned Logo" />
        <h1>Today I Learned</h1>
      </div>

      <button
        className="btn btn-large btn-open"
        onClick={() => setShowForm((show) => !show)}
      >
        {showForm ? "Close" : "Share a fact"}
      </button>
    </header>
  );
}

function Loader() {
  return <p className="message">Loading...</p>;
}

function NewFactForm({ setFacts, setShowForm, addCategory, categories }) {
  const [text, setText] = useState("");
  const [source, setSource] = useState("");
  const [category, setCategory] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [newCategoryColor, setNewCategoryColor] = useState("");

  const textLength = text.length;

  async function handleSubmit(e) {
    e.preventDefault();

    if (text && source && (category || newCategory) && textLength <= 200) {
      if (newCategory) {
        const color = newCategoryColor || getRandomColor();
        addCategory({ name: newCategory.toLowerCase(), color });
        setCategory(newCategory.toLowerCase());
      }

      setIsUploading(true);
      const { data: newFact, error } = await supabase
        .from("facts")
        .insert([{ text, source, category: category || newCategory.toLowerCase() }])
        .select();
      setIsUploading(false);
      console.log(newFact);

      if (!error) setFacts((facts) => [newFact[0], ...facts]);

      setText("");
      setCategory("");
      setSource("");
      setShowForm(false);
    }
  }

  return (
    <form className="fact-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Share a fact with the world..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={isUploading}
      />
      <span>{200 - textLength}</span>
      <input
        type="text"
        placeholder="Trustworthy source..."
        value={source}
        onChange={(e) => setSource(e.target.value)}
        disabled={isUploading}
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        disabled={isUploading}
      >
        <option value="">Choose category:</option>
        {categories.map((cat) => (
          <option key={cat.name} value={cat.name}>
            {cat.name.toUpperCase()}
          </option>
        ))}
        <option value="new">+ Add new category</option>
      </select>
      {category === "new" && (
        <>
          <input
            type="text"
            placeholder="New category..."
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          />
          <input
            type="color"
            value={newCategoryColor}
            onChange={(e) => setNewCategoryColor(e.target.value)}
          />
        </>
      )}
      <button className="btn btn-large" disabled={isUploading}>
        Post
      </button>
    </form>
  );
}

function CategoryFilter({ setCurrentCategory, categories }) {
  return (
    <aside>
      <ul>
        <li className="category">
          <button
            className="btn btn-all-categories"
            onClick={() => setCurrentCategory("all")}
          >
            All
          </button>
        </li>
        {categories.map((cat) => (
          <li key={cat.name} className="category">
            <button
              className="btn btn-category"
              onClick={() => setCurrentCategory(cat.name)}
              style={{ backgroundColor: cat.color }}
            >
              {cat.name}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}

function FactList({ facts, setFacts, categories }) {
  if (facts.length === 0) {
    return <p className="message">No facts in this category</p>;
  }
  return (
    <section>
      <ul className="facts-list">
        {facts.map((fact) => (
          <Fact key={fact.id} fact={fact} setFacts={setFacts} categories={categories} />
        ))}
      </ul>
    </section>
  );
}

function Fact({ fact, setFacts, categories }) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [showComments, setShowComments] = useState(false);

  const isDisputed = fact.votesInteresting + fact.votesMindblowing < fact.votesFalse;

  async function handleVote(columnName) {
    setIsUpdating(true);
    const { data: updatedFact, error } = await supabase
      .from("facts")
      .update({ [columnName]: fact[columnName] + 1 })
      .eq("id", fact.id)
      .select();
    setIsUpdating(false);
    if (!error) setFacts((facts) => facts.map((f) => (f.id === fact.id ? updatedFact[0] : f)));
  }

  return (
    <li className="fact">
      <p>
        {isDisputed ? <span className="disputed">[DISPUTED] </span> : null}
        {fact.text}
        <a className="source" href={fact.source} target="_blank" rel="noopener noreferrer">
          (Source)
        </a>
      </p>
      <span
        className="tag"
        style={{
          backgroundColor: categories.find((cat) => cat.name === fact.category)?.color,
        }}
      >
        {fact.category}
      </span>
      <div className="vote-buttons">
        <button onClick={() => handleVote("votesInteresting")} disabled={isUpdating}>
          👍 {fact.votesInteresting}
        </button>
        <button onClick={() => handleVote("votesMindblowing")} disabled={isUpdating}>
          🤯 {fact.votesMindblowing}
        </button>
        <button onClick={() => handleVote("votesFalse")} disabled={isUpdating}>
          ⛔️ {fact.votesFalse}
        </button>
        <button onClick={() => setShowComments(!showComments)} disabled={isUpdating}>
          💬 {fact.commentsCount}
        </button>
      </div>
      {showComments && <Comments factId={fact.id} />}
    </li>
  );
}

export default App;
