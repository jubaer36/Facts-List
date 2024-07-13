import Comments from "./Comments";
function FactModal({ fact, categories, onClose, handleVote, isUpdating }) {
    const isDisputed = fact.votesInteresting + fact.votesMindblowing < fact.votesFalse;
  
    return (
      <div className="modal">
        <div className="modal-content">
          <span className="close" onClick={onClose}>&times;</span>
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
            <button disabled>
              💬 {fact.commentsCount}
            </button>
          </div>
          <Comments factId={fact.id} />
        </div>
      </div>
    );
  }
  
  export default FactModal;
  