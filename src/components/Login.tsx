import { useState } from 'react';
import type { FormEvent } from 'react';

const API_URL = 'https://cards-api.lukaszavaleta.xyz';

type LoginResponse = {
  token?: string;
  user?: {
    _id?: string;
    login?: string;
  };
  error?: string;
};

type LoginProps = {
  onLogin: () => void;
};

function Login({ onLogin }: LoginProps) {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          login,
          password,
        }),
      });

      const data: LoginResponse = await response.json();

      if (!response.ok || !data.token) {
        setMessage(data.error || 'Login failed');
        return;
      }

      if (!data.user?._id) {
        setMessage('Login response is missing a user ID.');
        return;
        }

        sessionStorage.setItem('cardsToken', data.token);
        sessionStorage.setItem('cardsUserId', data.user._id);
        onLogin();

      setMessage(`Successfully logged in as ${data.user?.login || login}!`);
      setPassword('');

    } catch (error) {
      console.error('Login error:', error);
      setMessage('Unable to connect to the backend.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h2>Please Log In</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="login">Username</label>
          <input
            id="login"
            type="text"
            value={login}
            onChange={(event) => setLogin(event.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Log In'}
        </button>
      </form>

      <p role="status">{message}</p>
    </div>
  );
}

export default Login;