// Comments.js
import { useEffect, useState } from "react";
import supabase from "./supabase";


function Comments({ factId }) {
    const [comments, setComments] = useState([]);
    const [commentText, setCommentText] = useState("");
    const [isLoading, setIsLoading] = useState(false);
  
    useEffect(() => {
      async function fetchComments() {
        const { data: comments, error } = await supabase
          .from("comments")
          .select("*")
          .eq("fact_id", factId)
          .neq("comment", null) // Filter out null comments
          .neq("comment", "") // Filter out empty comments
          .order("created_at", { ascending: true });
  
        if (error) {
          console.error("Error fetching comments:", error);
        } else {
          console.log("Fetched comments:", comments); // Debugging line
          setComments(comments);
        }
      }
  
      fetchComments();
    }, [factId]);
  
    async function handleAddComment(e) {
      e.preventDefault();
      setIsLoading(true);
      const { data: newComment, error } = await supabase
        .from("comments")
        .insert([{ comment: commentText, fact_id: factId }])
        .select();
  
      if (error) {
        console.error("Error adding comment:", error);
      } else {
        console.log("Added comment:", newComment); // Debugging line
        setComments([...comments, newComment[0]]);
      }
      setCommentText("");
      setIsLoading(false);
    }
  
    return (
      <div className="comments-section">
        <ul>
          {comments.map((comment) => (
            <li key={comment.id}>{comment.comment}</li>
          ))}
        </ul>
        <form className="comment-form" onSubmit={handleAddComment}>
          <input className="comment-text"
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Add a comment..."
            disabled={isLoading}
          />
          <button className="btn" type="submit" disabled={isLoading}>
            Post
          </button>
        </form>
      </div>
    );
  }
    
    
export default Comments;
