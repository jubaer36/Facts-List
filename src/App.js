import { useEffect, useState } from "react";
import "./style.css";
import supabase from "./supabase";

const CATEGORIES = [
  { name: "technology", color: "#3b82f6" },
  { name: "science", color: "#16a34a" },
  { name: "finance", color: "#ef4444" },
  { name: "society", color: "#eab308" },
  { name: "entertainment", color: "#db2777" },
  { name: "health", color: "#14b8a6" },
  { name: "history", color: "#f97316" },
  { name: "news", color: "#8b5cf6" },
];

// function Counter() {
//   const [count, setCount] = useState(0);

//   return <div>
//     <span style={{ fontSize: '40px' }}>{count}</span>
//     <button className="btn-large btn" onClick={() => setCount((c) => c + 1)}>+1</button>
//   </div>
// }

function App() {
  const [showForm, setShowForm] = useState(false);
  const [facts, setFacts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCategory, setCurrentCategory] = useState("all");

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
      {/* <Counter/> */}
      {showForm ? (
        <NewFactForm setFacts={setFacts} setShowForm={setShowForm} />
      ) : null}
      <main className="main">
        <CategoryFilter setCurrentCategory={setCurrentCategory} />
        {isLoading ? <Loader /> : <FactList facts={facts} setFacts={setFacts} />}
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

function NewFactForm({ setFacts, setShowForm }) {
  const [text, setText] = useState("");
  const [source, setSource] = useState("");
  const [category, setCategory] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const textLength = text.length;

  // To prevent the page from reloading
  async function handleSubmit(e) {
    e.preventDefault();
    // Check the validity and create a new fact
    if (text && source && category && textLength <= 200) {
      // Create a new fact object

      // Upload newfact to supabase
      setIsUploading(true);
      const { data: newFact, error } = await supabase
        .from("facts")
        .insert([{ text, source, category }])
        .select();
      setIsUploading(false);
      console.log(newFact);

      // Add the new fact to the user interface

      if (!error) setFacts((facts) => [newFact[0], ...facts]);
      // Reset input fields

      setText("");
      setCategory("");
      setSource("");
      // Close the form
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
        {CATEGORIES.map((cat) => (
          <option key={cat.name} value={cat.name}>
            {cat.name.toUpperCase()}
          </option>
        ))}
      </select>
      <button className="btn btn-large" disabled={isUploading}>
        Post
      </button>
    </form>
  );
}

function CategoryFilter({ setCurrentCategory }) {
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
        {CATEGORIES.map((cat) => (
          <li key={cat.name} className="category">
            <button
              className="btn btn-category"
              onClick={() => setCurrentCategory(cat.name)}
              style={{ backgroundColor: cat.color }}
            >
              {cat.name}
            </button>
            +
          </li>
        ))}
      </ul>
    </aside>
  );
}

function FactList({ facts,setFacts  }) {
  if (facts.length === 0) {
    return <p className="message">No facts in this category</p>;
  }
  return (
    <section>
      <ul className="facts-list">
        {facts.map((fact) => (
          <Fact key={fact.id} fact={fact} setFacts={setFacts}/>
        ))}
      </ul>
    </section>
  );
}

function Fact({ fact , setFacts }) {

  const [isUpdating , setIsUpdating] = useState(false);
  const isDisputed = fact.votesInteresting + fact.votesMindblowing < fact.votesFalse;

  async function handleVote(columnName) {
    setIsUpdating(true);
    const { data: updatedFact, error } = await supabase
      .from("facts")
      .update({ [columnName]: fact[columnName] + 1 })
      .eq("id", fact.id)
      .select();
      setIsUpdating(false);
    console.log(updatedFact);
    if(!error)setFacts((facts)=>facts.map((f)=>f.id===fact.id?updatedFact[0]:f));
  }
  return (
    <li className="fact">
      <p>
        {isDisputed?<span className="disputed">[DISPUTED] </span>:null}
        {fact.text}
        <a className="source" href={fact.source} target="_blank">
          (Source)
        </a>
      </p>
      <span
        className="tag"
        style={{
          backgroundColor: CATEGORIES.find((cat) => cat.name === fact.category)
            .color,
        }}
      >
        {fact.category}
      </span>
      <div className="vote-buttons">
        <button onClick={()=>handleVote("votesInteresting")} disabled={isUpdating}>👍 {fact.votesInteresting}</button>
        <button onClick={()=>handleVote("votesMindblowing")} disabled={isUpdating}>🤯 {fact.votesMindblowing}</button>
        <button onClick={()=>handleVote("votesFalse")} disabled={isUpdating}>⛔️ {fact.votesFalse}</button>
      </div>
    </li>
  );
}

export default App;
