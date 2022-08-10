import { useState } from 'react';
import MainMint from './components/MainMint'
import NavBar from './components/NavBar'
import './App.css';

function App() {

  return (
    <div>
    <div className="App">
    <NavBar />
    <MainMint />
    </div>
    <div className='moving-background'></div>
    </div>
  );
}

export default App;
