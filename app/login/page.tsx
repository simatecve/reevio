'use client';

import { useState } from 'react';
import Login from '../../components/Login';
import Register from '../../components/Register';

export default function LoginPage() {
  const [showRegister, setShowRegister] = useState(false);

  return (
    <div>
      {showRegister ? (
        <Register onSwitchToLogin={() => setShowRegister(false)} />
      ) : (
        <Login onSwitchToRegister={() => setShowRegister(true)} />
      )}
    </div>
  );
}