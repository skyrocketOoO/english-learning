'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isRegistering, setIsRegistering] = useState(false); // Toggle between login and register
  const router = useRouter();

  const handleSubmit = async () => {
    if (!username || !password) {
      setMessage('Username and password are required.');
      return;
    }

    const endpoint = isRegistering ? '/api/register' : '/api/login';

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);

        // Store session token (or other session data) in localStorage
        if (data.token) {
          localStorage.setItem('sessionToken', data.token);
        }

        if (!isRegistering) {
          router.push('/word'); // Redirect after successful login
        }
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('An error occurred. Please try again.');
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
      <h1 className="text-4xl font-bold mb-4">
        {isRegistering ? 'Register' : 'Login'}
      </h1>
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your username"
          className="w-full px-4 py-2 border rounded-md mb-4"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          className="w-full px-4 py-2 border rounded-md mb-4"
        />
        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 w-full"
        >
          {isRegistering ? 'Register' : 'Login'}
        </button>
        <p
          className="mt-4 text-center text-gray-700 cursor-pointer"
          onClick={() => {
            setIsRegistering(!isRegistering);
            setMessage('');
          }}
        >
          {isRegistering
            ? 'Already have an account? Login'
            : 'Need an account? Register'}
        </p>
        {message && <p className="mt-4 text-center text-gray-700">{message}</p>}
      </div>
    </main>
  );
}
