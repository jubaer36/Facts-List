// CommentForm.js
import { useState } from "react";
import supabase from "./supabase";

function CommentForm({ factId, addComment }) {
  const [comment, setComment] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (comment.trim()) {
      const { data: newComment, error } = await supabase
        .from("comments")
        .insert([{ fact_id: factId, comment }])
        .select();
      if (!error) {
        addComment(newComment[0]);
        setComment("");
      } else {
        console.error("Error adding comment:", error);
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="comment-form">
      <input
        type="text"
        placeholder="Add a comment..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <button type="submit">Post</button>
    </form>
  );
}

export default CommentForm;
