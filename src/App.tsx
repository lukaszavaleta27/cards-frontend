import { useState } from 'react';
import './App.css';
import LoginPage from './pages/LoginPage';
import CardsPage from './pages/CardsPage';

function App() {
  const [authenticated, setAuthenticated] = useState(
    Boolean(
      sessionStorage.getItem('cardsToken') &&
      sessionStorage.getItem('cardsUserId')
    )
  );

  function handleLogout() {
    sessionStorage.removeItem('cardsToken');
    sessionStorage.removeItem('cardsUserId');
    setAuthenticated(false);
  }

  return authenticated ? (
    <CardsPage onLogout={handleLogout} />
  ) : (
    <LoginPage onLogin={() => setAuthenticated(true)} />
  );
}

export default App;