import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api';
import { Card } from '../components/ui/card';

export default function Bookmarks(){
  const { user } = useAuth();
  const [items, setItems] = useState([]);

  useEffect(()=>{ if (user) setItems(user.bookmarks || []); }, [user]);

  if (!user) return <div style={{padding:20}}>Please login to see bookmarks.</div>;
  return (
    <div className="container">
      <div className="section-heading">
        <h3>Your Bookmarks</h3>
        <p className="muted">Stories you saved from the feed.</p>
      </div>
      {items.length === 0 && <Card className="empty-state">No bookmarks yet.</Card>}
      {items.map(s => (
        <Card key={s._id} className="story-card">
          <div>
            <a href={s.url} target="_blank" rel="noreferrer" className="story-title">{s.title}</a>
            <div className="story-meta">Points: {s.points}</div>
          </div>
        </Card>
      ))}
    </div>
  );
}
