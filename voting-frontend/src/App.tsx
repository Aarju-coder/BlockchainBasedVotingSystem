import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CreateElection from './pages/CreateElection';
import ElectionDetails from './pages/ElectionDetails';
import Vote from './pages/Vote';
import Elections from './pages/Elections';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="create-election" element={<CreateElection />} />
          <Route path="election/:id" element={<ElectionDetails />} />
          <Route path="vote/:id" element={<Vote />} />
          <Route path="elections" element={<Elections />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;