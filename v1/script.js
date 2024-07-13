
console.log("hello");
const btn = document.querySelector(".btn-open");
const form = document.querySelector(".fact-form");
const factsList = document.querySelector(".facts-list");

factsList.innerHTML = "";


btn.addEventListener("click", function () {

  if (form.classList.contains("hidden")) {
    form.classList.remove("hidden");
    btn.textContent = "Close";
  }
  else {
    form.classList.add("hidden");
    btn.textContent = "Share a fact";
  }
});

function createFactsList(dataArray) {
  const htmlArr = dataArray.map((fact) => `<li class ="fact"><p>
  ${fact.text}
  <a
    class="source"
    href="${fact.source}"
    target="_blank"
    >(Source)</a
  >
</p>
<span class="tag" style="background-color: ${
  CATEGORIES.find((cat)=>cat.name === fact.category).color
}"
  >${fact.category}</span
></li>`);
  const html = htmlArr.join(" ");
  // console.log(html);
  factsList.insertAdjacentHTML("afterbegin", html);

}
// let city = "Amsterdam";
// let age = 560;

// const str =`this city ${city} is ${age} years old.`;
// console.log(str);
// const calcAge = (year) => 2024 - year;
// const times = [2,3,4,5].map((el)=>el*10);
// console.log(times); 
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



loadFacts();

async function loadFacts(){
  const res  =await  fetch("https://pnpcxvgkyyyepvjrrfut.supabase.co/rest/v1/topics",{
  headers:{
    apikey:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBucGN4dmdreXl5ZXB2anJyZnV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTQ3NTc2ODEsImV4cCI6MjAzMDMzMzY4MX0.zSvS6W0CLMTri9HufqH5-ZdAyjN1fs_cH8xWCMmUn_A",
    authorization:"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBucGN4dmdreXl5ZXB2anJyZnV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTQ3NTc2ODEsImV4cCI6MjAzMDMzMzY4MX0.zSvS6W0CLMTri9HufqH5-ZdAyjN1fs_cH8xWCMmUn_A",

  }
})
const data = await res.json();
createFactsList(data);
// console.log(data);
}

 



//   const factAges = initialFacts.map((el)=>calcAge(el.createdIn));
//   console.log(factAges);