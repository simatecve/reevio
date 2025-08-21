'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { Plus, User, LogOut, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { getUserProfile } from '@/lib/profile';
import { generateUniqueSlug } from '@/lib/utils';

interface Board {
  id: number;
  name: string;
  description?: string;
  slug: string;
  color: string;
  user_id: string;
  created_at: string;
}

const Dashboard = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newBoardName, setNewBoardName] = useState('');
  const [newBoardDescription, setNewBoardDescription] = useState('');
  const [newBoardColor, setNewBoardColor] = useState('#3B82F6');
  const [creating, setCreating] = useState(false);

  const boardColors = [
    '#3B82F6', // Blue
    '#10B981', // Green
    '#F59E0B', // Yellow
    '#EF4444', // Red
    '#8B5CF6', // Purple
    '#F97316', // Orange
    '#06B6D4', // Cyan
    '#84CC16', // Lime
  ];

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/api/auth/signin?callbackUrl=%2Fdashboard');
    }
  }, [session, status, router]);

  // Load boards when session is available
  useEffect(() => {
    if (session === null) {
      // User is not authenticated, redirect will happen in the first useEffect
      return;
    }
    
    if (session) {
      loadBoards();
    }
  }, [session]);

  // Show loading screen while checking authentication
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-600 mb-4">Loading...</div>
          <button
            onClick={() => window.location.href = '/auth/signin'}
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-md font-medium transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please sign in to access your dashboard</h1>
          <button
            onClick={() => window.location.href = '/auth/signin'}
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-md font-medium transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  const resetForm = () => {
    setNewBoardName('');
    setNewBoardDescription('');
    setNewBoardColor('#3B82F6');
    setShowCreateForm(false);
  };

  const loadBoards = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/debug/get-boards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userEmail: session?.user?.email
        })
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        console.error('Error loading boards:', result);
        setBoards([]);
        return;
      }
      
      setBoards(result.boards || []);
    } catch (error) {
      console.error('Error loading boards:', error);
      setBoards([]);
    } finally {
      setLoading(false);
    }
  };

  const createBoard = async () => {
    if (!newBoardName.trim() || creating) return;

    console.log('CREATE BOARD - Starting creation process');
    console.log('CREATE BOARD - Session:', session);
    console.log('CREATE BOARD - User email:', session?.user?.email);
    console.log('CREATE BOARD - User ID:', session?.user?.id);

    setCreating(true);
    try {
      // Use API endpoint instead of direct Supabase client to avoid RLS issues
      const response = await fetch('/api/debug/create-board', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newBoardName.trim(),
          description: newBoardDescription.trim() || null,
          color: newBoardColor,
          userEmail: session?.user?.email
        })
      });

      const result = await response.json();
      
      if (!response.ok) {
        console.error('CREATE BOARD - API Error:', result);
        alert(result.error || 'Error creating board');
        return;
      }
      
      console.log('CREATE BOARD - Board created successfully:', result.board);
      
      // Refresh boards list
      await loadBoards();
      resetForm();
      
    } catch (error) {
      console.error('CREATE BOARD - Catch error:', error);
      alert('Error creating board. Please try again.');
    } finally {
      setCreating(false);
    }
  };

  const handleLogout = () => {
    router.push('/api/auth/signout');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <User className="w-8 h-8 text-gray-600" />
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {session?.user?.name || session?.user?.email}
                </h2>
                <p className="text-sm text-gray-500">{session?.user?.email}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Dashboard Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Dashboard
            </h1>
            <p className="text-gray-600">
              Transform customer feedback into actionable insights and build what your users actually need
            </p>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Create Board */}
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Create New Board
                </h2>
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <span className="text-sm font-medium text-gray-700">
                      Build what your users
                    </span>
                    <span className="bg-primary-600 text-white text-xs px-2 py-1 rounded">
                      actually
                    </span>
                    <span className="text-sm text-gray-700">need</span>
                  </div>

                  {showCreateForm ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Board Name
                        </label>
                        <input
                          type="text"
                          value={newBoardName}
                          onChange={(e) => setNewBoardName(e.target.value)}
                          placeholder="e.g., Feature Requests"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Description (optional)
                        </label>
                        <textarea
                          value={newBoardDescription}
                          onChange={(e) => setNewBoardDescription(e.target.value)}
                          placeholder="What kind of feedback are you looking for?"
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Board Color
                        </label>
                        <div className="flex space-x-2">
                          {boardColors.map((color) => (
                            <button
                              key={color}
                              onClick={() => setNewBoardColor(color)}
                              className={`w-8 h-8 rounded-full border-2 transition-all ${
                                newBoardColor === color
                                  ? 'border-gray-900 scale-110'
                                  : 'border-gray-300 hover:border-gray-400'
                              }`}
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex space-x-3">
                        <button
                          onClick={createBoard}
                          disabled={creating || !newBoardName.trim()}
                          className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {creating ? 'Creating...' : 'Create Board'}
                        </button>
                        <button
                          onClick={() => {
                            setShowCreateForm(false);
                            resetForm();
                          }}
                          className="text-gray-500 hover:text-gray-700 px-3 py-2"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-3">
                      <input
                        type="text"
                        placeholder="Future Unicorn Inc. 🦄"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                        readOnly
                        onClick={() => setShowCreateForm(true)}
                      />
                      <button
                        onClick={() => setShowCreateForm(true)}
                        className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-md font-medium transition-colors"
                      >
                        Create Board
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Boards List */}
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Your Boards ({boards.length})
                </h2>
                
                {/* Boards List */}
                {boards.length > 0 ? (
                  <div className="space-y-4">
                    {boards.map((board) => (
                      <Link key={board.id} href={`/board/${board.slug}`}>
                        <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-all cursor-pointer group hover:border-primary-200">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <div
                                  className="w-3 h-3 rounded-full"
                                  style={{ backgroundColor: board.color }}
                                />
                                <h3 className="text-base font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                                  {board.name}
                                </h3>
                                <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-primary-600 transition-colors" />
                              </div>
                              {board.description && (
                                <p className="text-gray-600 text-sm mb-2 line-clamp-2">{board.description}</p>
                              )}
                              <p className="text-xs text-gray-500">
                                Created {new Date(board.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-8 text-center">
                    <Plus className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium text-gray-600 mb-2">No boards yet</p>
                    <p className="text-sm text-gray-500">
                      Create your first board to start collecting feedback
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;