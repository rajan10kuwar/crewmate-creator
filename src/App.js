import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import './App.css';

const supabase = createClient(process.env.REACT_APP_SUPABASE_URL, process.env.REACT_APP_SUPABASE_KEY);

function App() {
  const [name, setName] = useState('');
  const [speed, setSpeed] = useState('');
  const [color, setColor] = useState('Red');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!supabase) {
      console.error('Supabase client not initialized. Check .env file.');
      return;
    }
    const { data, error } = await supabase
      .from('crewmates')
      .insert([{ name, speed, color, created_at: new Date().toISOString() }]);

    if (error) {
      console.error('Error creating crewmate:', error.message);
    } else {
      alert('Crewmate created successfully!');
      setName('');
      setSpeed('');
      setColor('Red');
    }
  };

  return (
    <div className="app">
      <div className="sidebar">
        <a href="#home">Home</a>
        <a href="#create">Create a Crewmate!</a>
        <a href="#gallery">Crewmate Gallery</a>
      </div>
      <div className="content">
        <h1>Create a New Crewmate</h1>
        <img src="crewmate.jpg" alt="Crewmates" className="header-img" />
        <form onSubmit={handleSubmit}>
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
            <select value={color} onChange={(e) => setColor(e.target.value)}>
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
      </div>
    </div>
  );
}

export default App;