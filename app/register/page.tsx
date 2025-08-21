'use client';

import { useState } from 'react';
import Login from '../../components/Login';
import Register from '../../components/Register';

export default function RegisterPage() {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <div>
      {showLogin ? (
        <Login onSwitchToRegister={() => setShowLogin(false)} />
      ) : (
        <Register onSwitchToLogin={() => setShowLogin(true)} />
      )}
    </div>
  );
}