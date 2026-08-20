import { createContext, useState, useContext, useEffect } from 'react';
import { generateTraceId } from '../util/TraceIdGenerater.jsx';

const DataContext = createContext();

export function DataProvider({ children }) {
  const [feedRows, setFeedRows] = useState([]);

  const refreshAllData = async () => {
    try {
      console.log('Fetching feed data from Spring Boot backend...');
      const [feedRes] = await Promise.all([
        fetch('http://localhost:8080/v1/feed', {
          headers: {
            'Content-Type': 'application/json',
            'traceId': generateTraceId()
          },
          credentials: 'include', // Include credentials for session management
        })
      ]);

      setFeedRows(await feedRes.json());
    } catch {
      console.error('Error refreshing data');
    }
  };

  useEffect(() => { refreshAllData(); }, []);

  return (
    <DataContext.Provider value={{ feedRows, refreshAllData, setFeedRows }}>
      {children}
    </DataContext.Provider>
  );
}

export function toggleLike(videoId, nextLiked) {
  console.log(`video ${videoId} ${nextLiked ? "liked" : "unliked"}, toggling like on backend`);

  const toggleVideoLike = async () => {
    try {
      const res = await fetch('http://localhost:8080/v1/likes/toggle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'traceId': generateTraceId(),
          'video_id': videoId
        },
        credentials: 'include'
      });

      console.log(await res.text());
    } catch (err) {
      console.error('Error toggling like', err);
    }
  };

  toggleVideoLike();
}

export async function postComment(videoId, text) {
  console.log(`attempting to post comment: ${JSON.stringify({ videoId, text })}`);
  try {
    const res = await fetch('http://localhost:8080/v1/comments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'traceId': generateTraceId(),
      },
      credentials: 'include',
      body: JSON.stringify({ videoId, text }),
    });

    if (!res.ok) throw new Error(`Status ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error('Error posting comment', err);
    return null;
  }
}

export async function deleteComment(comment) {
  console.log(`deleing the comment ${JSON.stringify(comment)}`);
  try {
    const res = await fetch('http://localhost:8080/v1/comments', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'traceId': generateTraceId(),
        'comment_id': comment.id
      },
      credentials: 'include'
    });

    if (!res.ok) throw new Error(`Status ${res.status}`);
    return true;
  } catch (err) {
    console.error('Error posting comment', err);
    return false;
  }
}

export async function editComment(commentId, text) {
  console.log(`editing the comment ${JSON.stringify(commentId)}`);
  try {
    const res = await fetch('http://localhost:8080/v1/comments', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'traceId': generateTraceId(),
        'comment_id': commentId
      },
      credentials: 'include',
      body: JSON.stringify({ text }),
    });

    if (!res.ok) throw new Error(`Status ${res.status}`);
    return true;
  } catch (err) {
    console.error('Error posting comment', err);
    return false;
  }
}

export async function getComments(videoId) {
  console.log(`getting comments for ${videoId}`);

  try {
    const res = await fetch('http://localhost:8080/v1/comments', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'traceId': generateTraceId(),
        'video_id': videoId
      },
      credentials: 'include'
    });

    return await res.json();
  } catch (err) {
    console.error('Error getting comments', err);
    return [];
  }
}

export const useGlobalData = () => useContext(DataContext);