import { useState } from 'react';
import type { FormEvent } from 'react';

function Login() {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(`Login form ready for ${login}`);
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

        <button type="submit">Log In</button>
      </form>

      <p role="status">{message}</p>
    </div>
  );
}

export default Login;