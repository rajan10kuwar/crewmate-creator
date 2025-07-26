import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import './App.css';

console.log('Env vars:', process.env.REACT_APP_SUPABASE_URL, process.env.REACT_APP_SUPABASE_KEY);
const supabase = createClient(process.env.REACT_APP_SUPABASE_URL, process.env.REACT_APP_SUPABASE_KEY);

function App() {
  const [name, setName] = useState('');
  const [speed, setSpeed] = useState('');
  const [color, setColor] = useState('');
  const [crewmates, setCrewmates] = useState([]);
  const [currentPage, setCurrentPage] = useState('home');
  const [message, setMessage] = useState('');

  useEffect(() => {
    console.log('Current page:', currentPage);
    if (currentPage === 'gallery') {
      fetchCrewmates();
    }
  }, [currentPage]);

  const fetchCrewmates = async () => {
    console.log('Fetching crewmates...');
    const { data, error } = await supabase
      .from('crewmates')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      console.error('Fetch error:', error);
      setMessage(`Failed to load crewmates: ${error.message}`);
    } else {
      console.log('Fetched crewmates:', data);
      setCrewmates(data || []);
      setMessage('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted:', { name, speed, color });
    if (!supabase) {
      console.error('Supabase not initialized');
      setMessage('Supabase not initialized. Check .env file.');
      return;
    }
    if (!color) {
      setMessage('Please select a color!');
      return;
    }
    setMessage('Creating crewmate...');
    try {
      const { data, error } = await supabase
        .from('crewmates')
        .insert([{ name, speed, color, created_at: new Date().toISOString() }]);
      if (error) {
        console.error('Insert error:', error);
        setMessage(`Error creating crewmate: ${error.message}`);
      } else {
        console.log('Crewmate created:', data);
        setMessage('Crewmate created successfully!');
        setName('');
        setSpeed('');
        setColor('');
        if (currentPage === 'gallery') fetchCrewmates();
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setMessage('Unexpected error occurred.');
    }
  };

  return (
    <div className="app">
      <div className="sidebar">
        <a href="#home" onClick={() => setCurrentPage('home')}>Home</a>
        <a href="#create" onClick={() => setCurrentPage('create')}>Create a Crewmate!</a>
        <a href="#gallery" onClick={() => setCurrentPage('gallery')}>Crewmate Gallery</a>
      </div>
      <div className="content">
        {currentPage === 'home' && (
          <div className="home-page">
            <h1>Welcome to Crewmate Creator!</h1>
            <p>
              Hello! It’s {new Date().toLocaleTimeString('en-US', { timeZone: 'America/New_York', hour: '2-digit', minute: '2-digit' })} EDT on{' '}
              {new Date().toLocaleDateString('en-US', { timeZone: 'America/New_York' })}.<br />
              Create your own crewmates and send them into space!
            </p>
            <img src="/crewmates.png" alt="Crewmates" className="header-img" />
          </div>
        )}
        {currentPage === 'create' && (
          <>
            <h1>Create a New Crewmate</h1>
            <img src="/crewmate.jpg" alt="Crewmates" className="header-img" />
            <form onSubmit={handleSubmit} className="create-form">
              <div className="form-group">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter crewmate's name"
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="number"
                  value={speed}
                  onChange={(e) => setSpeed(e.target.value)}
                  placeholder="Enter speed in mph"
                  required
                />
              </div>
              <div className="form-group">
                <select value={color} onChange={(e) => setColor(e.target.value)} required>
                  <option value="" disabled>Choose a color</option>
                  <option value="Red">Red</option>
                  <option value="Green">Green</option>
                  <option value="Blue">Blue</option>
                  <option value="Purple">Purple</option>
                  <option value="Yellow">Yellow</option>
                  <option value="Orange">Orange</option>
                  <option value="Pink">Pink</option>
                  <option value="Rainbow">Rainbow</option>
                </select>
              </div>
              <button type="submit">Create Crewmate</button>
            </form>
            {message && <p className={`message ${message.includes('successfully') ? 'success' : ''}`}>{message}</p>}
          </>
        )}
        {currentPage === 'gallery' && (
          <>
            <h1 className="gallery-title">Crewmate Gallery</h1>
            {crewmates.length === 0 ? (
              <div className="empty-gallery">
                <p>You haven't made a crewmate yet!</p>
                <button onClick={() => setCurrentPage('create')}>Create One Now!</button>
              </div>
            ) : (
              <div className="gallery">
                {crewmates.map((crewmate) => (
                  <div key={crewmate.id} className="crewmate-card" style={{ borderColor: crewmate.color }}>
                    <img src="/crewmate.jpg" alt={crewmate.name} className="crewmate-img" />
                    <div className="card-content">
                      <h3>{crewmate.name}</h3>
                      <p>Speed: {crewmate.speed} mph</p>
                      <p>Color: {crewmate.color}</p>
                      <p>Created: {new Date(crewmate.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;