import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import API from '../api';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';

export default function Stories(){
  const [stories, setStories] = useState([]);
  const { user, refresh } = useAuth();

  useEffect(()=>{ fetchStories(); }, []);
  const fetchStories = async ()=>{
    const res = await API.get('/stories');
    setStories(res.data);
  };

  const isBookmarked = (storyId) => {
    return user?.bookmarks?.some(b => String(b._id) === String(storyId));
  };

  const toggle = async (id) => {
    const wasBookmarked = isBookmarked(id);
    await API.post(`/stories/${id}/bookmark`);
    // refresh user data to update bookmarks
    if (user) await refresh();
    else await fetchStories();

    // Show toast notification
    if (wasBookmarked) {
      toast.success('Bookmark removed!', { duration: 2000 });
    } else {
      toast.success('Story bookmarked!', { duration: 2000 });
    }
    fetchStories();
  };

  return (
    <div className="container">
      <div className="section-heading">
        <h3>Top Stories</h3>
        <p className="muted">Latest Hacker News stories, sorted by points.</p>
      </div>
      {stories.map(s => {
        const bookmarked = isBookmarked(s._id);
        return (
          <Card key={s._id} className={`story-card ${bookmarked ? 'story-card-bookmarked' : ''}`}>
            <div style={{flex:1}}>
              <a href={s.url} target="_blank" rel="noreferrer" className="story-title">{s.title}</a>
              <div className="story-meta">Points: {s.points} — Author: {s.author} — {s.postedAt}</div>
            </div>
            <div className="actions">
              <Button type="button" onClick={()=>toggle(s._id)} className={bookmarked ? 'btn-bookmarked' : ''}>
                {bookmarked ? '★ Bookmarked' : '☆ Bookmark'}
              </Button>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
