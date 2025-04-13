import React, { useState } from 'react';

interface AuthResponse {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  userType: string;
}

export function AuthTest() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [userType, setUserType] = useState('student');
  const [message, setMessage] = useState('');
  const [currentUser, setCurrentUser] = useState<AuthResponse | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          password,
          email,
          firstName,
          lastName,
          userType
        })
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('Registration successful!');
        setCurrentUser(data);
      } else {
        setMessage(data.error || 'Registration failed');
      }
    } catch (err) {
      setMessage('Registration failed');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('Login successful!');
        setCurrentUser(data);
      } else {
        setMessage(data.error || 'Login failed');
      }
    } catch (err) {
      setMessage('Login failed');
    }
  };

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/logout', { method: 'POST' });
      if (res.ok) {
        setMessage('Logged out successfully');
        setCurrentUser(null);
      }
    } catch (err) {
      setMessage('Logout failed');
    }
  };

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/user');
      const data = await res.json();
      if (res.ok) {
        setMessage('User is authenticated');
        setCurrentUser(data);
      } else {
        setMessage('User is not authenticated');
        setCurrentUser(null);
      }
    } catch (err) {
      setMessage('Auth check failed');
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Auth Test</h2>
      
      {currentUser ? (
        <div className="mb-4">
          <p>Logged in as: {currentUser.username}</p>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <form onSubmit={handleRegister} className="space-y-2">
            <h3 className="text-xl font-semibold">Register</h3>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="border p-2 rounded w-full"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border p-2 rounded w-full"
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border p-2 rounded w-full"
            />
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="border p-2 rounded w-full"
            />
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="border p-2 rounded w-full"
            />
            <select
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
              className="border p-2 rounded w-full"
            >
              <option value="student">Student</option>
              <option value="mentor">Mentor</option>
            </select>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded w-full"
            >
              Register
            </button>
          </form>

          <form onSubmit={handleLogin} className="space-y-2">
            <h3 className="text-xl font-semibold">Login</h3>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="border p-2 rounded w-full"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border p-2 rounded w-full"
            />
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded w-full"
            >
              Login
            </button>
          </form>
        </div>
      )}

      <button
        onClick={checkAuth}
        className="bg-gray-500 text-white px-4 py-2 rounded mt-4"
      >
        Check Auth Status
      </button>

      {message && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <p>{message}</p>
        </div>
      )}
    </div>
  );
}
