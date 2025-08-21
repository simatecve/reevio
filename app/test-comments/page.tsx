'use client';

import { useState, useEffect } from 'react';
import CommentSection from '@/components/CommentSection';
import { getCurrentUser } from '@/lib/auth';

export default function TestCommentsPage() {
  const [user, setUser] = useState<any>(null);
  
  useEffect(() => {
    setUser(getCurrentUser());
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Prueba de Sistema de Comentarios
          </h1>
          
          {user ? (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
              <p className="text-green-800">
                <strong>Usuario autenticado:</strong> {user.name} ({user.email})
              </p>
            </div>
          ) : (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-800">
                No hay usuario autenticado
              </p>
            </div>
          )}
          
          <div className="border-t pt-6">
            <h2 className="text-lg font-semibold mb-4">Post de Prueba</h2>
            <p className="text-gray-700 mb-4">
              Este es un post de prueba para verificar que el sistema de comentarios funciona correctamente.
            </p>
            
            {/* Using a real post ID from the test board */}
            <CommentSection postId="af717a9b-6abc-462f-ad67-bd01c1befc0d" />
          </div>
        </div>
      </div>
    </div>
  );
}