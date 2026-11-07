import { useState } from 'react';
import type { FormEvent } from 'react';

const API_URL = 'https://cards-api.lukaszavaleta.xyz';

type RegisterResponse = {
  message?: string;
  error?: string;
};

function Register() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [login, setLogin] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage('');
    setSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/api/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          login: login.trim(),
          email: email.trim(),
          password,
        }),
      });

      const data: RegisterResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      setMessage('Account created! You can now log in above.');

      setFirstName('');
      setLastName('');
      setLogin('');
      setEmail('');
      setPassword('');
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : 'Unable to register. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section>
      <h2>Create an Account</h2>

      <form onSubmit={handleRegister}>
        <div>
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            autoComplete="given-name"
            required
          />
        </div>

        <div>
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
            autoComplete="family-name"
            required
          />
        </div>

        <div>
          <input
            type="text"
            placeholder="Username"
            value={login}
            onChange={(event) => setLogin(event.target.value)}
            autoComplete="username"
            required
          />
        </div>

        <div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            required
          />
        </div>

        <div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="new-password"
            required
          />
        </div>

        <button type="submit" disabled={submitting}>
          {submitting ? 'Registering...' : 'Register'}
        </button>
      </form>

      <p role="status">{message}</p>
    </section>
  );
}

export default Register;