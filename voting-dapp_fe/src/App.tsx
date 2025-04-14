import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ConnectWallet } from './components/ConnectWallet';
import { Home } from './pages/Home';
import { CreateElection } from './pages/CreateElection';
import { AddCandidates } from './pages/AddCandidates';
import { ElectionList } from './pages/ElectionList';
import { ElectionDetail } from './pages/ElectionDetail';
import { AdminDashboard } from './pages/AdminDashboard';
import { Toaster } from "sonner";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background relative">
        <div className="animated-background" />
        <header className="header">
          <div className="header-container">
            <Link to="/" className="site-title">DVoting</Link>
            <ConnectWallet />
          </div>
        </header>
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create" element={<CreateElection />} />
            <Route path="/add-candidates/:electionId" element={<AddCandidates />} />
            <Route path="/elections" element={<ElectionList />} />
            <Route path="/elections/:electionId" element={<ElectionDetail />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </main>
        <Toaster />
      </div>
    </Router>
  );
}

export default App;