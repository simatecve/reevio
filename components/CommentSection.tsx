'use client';

import React, { useState, useEffect } from 'react';
import { getCurrentUser } from '@/lib/auth';
import { formatTimeAgo } from '@/lib/utils';
import { MessageSquare, Send } from 'lucide-react';

interface Comment {
  id: string;
  content: string;
  user_id: string;
  post_id: string | number;
  created_at: string;
  profiles?: {
    name: string;
    email: string;
  };
}

interface User {
  id: string;
  email: string;
  name: string;
}

interface CommentSectionProps {
  postId: string | number;
}

export default function CommentSection({ postId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  
  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
  }, []);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/comments/${postId}`);
      const data = await response.json();
      
      if (response.ok) {
        setComments(data.comments || []);
      } else {
        console.error('Error fetching comments:', data.error);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const createComment = async (content: string) => {
    if (!user) return;

    try {
      const response = await fetch('/api/comments/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          post_id: postId,
          user_id: user.id,
          user_email: user.email,
          user_name: user.name,
        }),
      });

      if (response.ok) {
        fetchComments(); // Refresh comments
        setNewComment('');
      }
    } catch (error) {
      console.error('Error creating comment:', error);
    }
  };

  // Load comments on component mount
  useEffect(() => {
    fetchComments();
  }, [postId]);

  return (
    <div className="mt-4">
      <div className="flex items-center gap-2 text-gray-600 mb-4">
        <MessageSquare className="w-4 h-4" />
        <span>{comments.length} comentarios</span>
      </div>

      <div className="mt-4 space-y-4">
          {/* Create comment form */}
          {user ? (
            <div className="flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Escribe un comentario..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    createComment(newComment.trim());
                  }
                }}
              />
              <button
                onClick={() => createComment(newComment.trim())}
                disabled={!newComment.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                Enviar
              </button>
            </div>
          ) : (
            <div className="text-gray-500 text-sm">
              Inicia sesión para comentar
            </div>
          )}

          {/* Comments list */}
          {loading ? (
            <div className="text-gray-500">Cargando comentarios...</div>
          ) : (
            <div className="space-y-3">
              {comments.map((comment) => (
                <div key={comment.id} className="bg-gray-50 p-3 rounded-md">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">
                      {comment.profiles?.name || 'Usuario'}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatTimeAgo(comment.created_at)}
                    </span>
                  </div>
                  <p className="text-gray-700">{comment.content}</p>
                </div>
              ))}
              {comments.length === 0 && (
                <div className="text-gray-500 text-sm">
                  No hay comentarios aún. ¡Sé el primero en comentar!
                </div>
              )}
            </div>
          )}
      </div>
    </div>
  );
}