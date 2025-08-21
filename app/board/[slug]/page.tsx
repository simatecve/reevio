'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, Plus, ChevronUp, ChevronDown, MessageSquare } from 'lucide-react';
import { formatTimeAgo } from '@/lib/utils';

interface Board {
  id: number;
  name: string;
  description?: string;
  slug: string;
  color: string;
  user_id: string;
  created_at: string;
}

interface Post {
  id: number;
  title: string;
  description?: string;
  board_id: number;
  user_id: string;
  votes_count: number;
  created_at: string;
  profiles: {
    name: string;
    email: string;
  };
}

interface Vote {
  id: number;
  post_id: number;
  user_id: string;
  vote_type: number;
}

interface Comment {
  id: number;
  content: string;
  post_id: number;
  user_id: string;
  created_at: string;
  updated_at: string;
  profiles: {
    name: string;
    email: string;
  };
}

const BoardPage = () => {
  const { data: session } = useSession();
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  
  const [board, setBoard] = useState<Board | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [userVotes, setUserVotes] = useState<Vote[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostDescription, setNewPostDescription] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  
  // Comments state
  const [comments, setComments] = useState<{ [postId: number]: Comment[] }>({});
  const [commentsCount, setCommentsCount] = useState<{ [postId: number]: number }>({});
  const [showComments, setShowComments] = useState<{ [postId: number]: boolean }>({});
  const [newComment, setNewComment] = useState<{ [postId: number]: string }>({});
  const [isCreatingComment, setIsCreatingComment] = useState<{ [postId: number]: boolean }>({});

  useEffect(() => {
    if (slug) {
      fetchBoard();
    }
  }, [slug]);

  useEffect(() => {
    if (board) {
      fetchPosts();
      if (session?.user?.id) {
        fetchUserVotes();
      }
    }
  }, [board]);

  // Separate effect for user votes when session changes
  useEffect(() => {
    if (board && session?.user?.id) {
      fetchUserVotes();
    }
  }, [session]);

  const fetchBoard = async () => {
    try {
      const { data, error } = await supabase
        .from('boards')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) {
        console.error('Error fetching board:', error);
        router.push('/dashboard');
        return;
      }

      setBoard(data);
    } catch (error) {
      console.error('Error fetching board:', error);
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const fetchPosts = async (shouldFetchComments = true) => {
    if (!board) return;

    try {
      const response = await fetch(`/api/posts/${board.id}`);
      const result = await response.json();

      if (!response.ok) {
        console.error('Error fetching posts:', result.error);
        return;
      }

      setPosts(result.posts || []);
      // Load comments count for each post only if requested
      if (result.posts && result.posts.length > 0 && shouldFetchComments) {
        fetchCommentsCount(result.posts);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const fetchCommentsCount = async (posts: Post[]) => {
    console.log('fetchCommentsCount called with posts:', posts.length);
    try {
      const counts: { [postId: number]: number } = {};
      const allComments: { [postId: number]: Comment[] } = {};
      
      // Fetch comments for each post
      await Promise.all(
        posts.map(async (post) => {
          console.log(`Fetching comments for post ${post.id}`);
          const response = await fetch(`/api/comments/${post.id}`);
          const result = await response.json();
          
          if (response.ok) {
            counts[post.id] = result.comments?.length || 0;
            allComments[post.id] = result.comments || [];
            console.log(`Post ${post.id} has ${counts[post.id]} comments`);
          } else {
            counts[post.id] = 0;
            allComments[post.id] = [];
            console.log(`Error fetching comments for post ${post.id}:`, result);
          }
        })
      );
      
      console.log('Final comments count:', counts);
      setCommentsCount(counts);
      setComments(allComments);
      
      // Hide comments for all posts by default
      const showAll: { [postId: number]: boolean } = {};
      posts.forEach(post => {
        showAll[post.id] = false;
      });
      setShowComments(showAll);
    } catch (error) {
      console.error('Error fetching comments count:', error);
    }
  };

  const fetchUserVotes = async () => {
    if (!session?.user?.id || !board) return;

    try {
      const response = await fetch(`/api/posts/user-votes/${board.id}`);
      const result = await response.json();

      if (!response.ok) {
        console.error('Error fetching user votes:', result.error);
        return;
      }

      setUserVotes(result.votes || []);
    } catch (error) {
      console.error('Error fetching user votes:', error);
    }
  };

  const createPost = async () => {
    if (!newPostTitle.trim() || !session?.user?.id || !board) return;

    try {
      setIsCreating(true);
      
      const response = await fetch('/api/posts/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newPostTitle.trim(),
          description: newPostDescription.trim() || null,
          board_id: board.id
        })
      });

      const result = await response.json();

      if (!response.ok) {
        console.error('Error creating post:', result.error);
        alert('Error creating post');
        return;
      }

      setPosts([result.post, ...posts]);
      setNewPostTitle('');
      setNewPostDescription('');
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Error creating post');
    } finally {
      setIsCreating(false);
    }
  };

  const vote = async (postId: string, voteType: number) => {
    if (!session?.user?.id) {
      alert('Please sign in to vote');
      return;
    }

    try {
      const response = await fetch('/api/posts/vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          post_id: postId,
          vote_type: voteType
        })
      });

      const result = await response.json();

      if (!response.ok) {
        console.error('Error voting:', result.error);
        return;
      }

      // Update local state based on the action
      const postIdNum = parseInt(postId);
      if (result.action === 'removed') {
        setUserVotes(userVotes.filter(vote => vote.post_id !== postIdNum));
      } else if (result.action === 'updated') {
        setUserVotes(userVotes.map(vote => 
          vote.post_id === postIdNum 
            ? { ...vote, vote_type: voteType }
            : vote
        ));
      } else if (result.action === 'created') {
        setUserVotes([...userVotes, result.vote]);
      }

      // Update the post's vote count in local state
      setPosts(posts.map(post => 
        post.id === parseInt(postId)
          ? { ...post, votes_count: result.votes_count }
          : post
      ));
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  const getUserVoteForPost = (postId: number) => {
    return userVotes.find(vote => vote.post_id === postId)?.vote_type || 0;
  };

  // Comments functions
  const fetchComments = async (postId: number) => {
    try {
      const response = await fetch(`/api/comments/${postId}`);
      const result = await response.json();

      if (!response.ok) {
        console.error('Error fetching comments:', result.error);
        return;
      }

      setComments(prev => ({
        ...prev,
        [postId]: result.comments || []
      }));
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const toggleComments = async (postId: number) => {
    const isCurrentlyShown = showComments[postId];
    
    setShowComments(prev => ({
      ...prev,
      [postId]: !isCurrentlyShown
    }));

    // Fetch comments if showing for the first time
    if (!isCurrentlyShown && !comments[postId]) {
      await fetchComments(postId);
    }
  };

  const createComment = async (postId: number) => {
    const content = newComment[postId]?.trim();
    if (!content || !session?.user) return;

    setIsCreatingComment(prev => ({ ...prev, [postId]: true }));

    try {
      const response = await fetch('/api/comments/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          post_id: postId
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error('Error creating comment:', result.error);
        return;
      }

      // Add new comment to local state
      setComments(prev => ({
        ...prev,
        [postId]: [...(prev[postId] || []), result.comment]
      }));

      // Update comments count
      setCommentsCount(prev => ({
        ...prev,
        [postId]: (prev[postId] || 0) + 1
      }));

      // Clear the input
      setNewComment(prev => ({ ...prev, [postId]: '' }));
    } catch (error) {
      console.error('Error creating comment:', error);
    } finally {
      setIsCreatingComment(prev => ({ ...prev, [postId]: false }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!board) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Board not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-primary-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push('/dashboard')}
              className="p-2 hover:bg-primary-100 rounded-lg transition-all duration-200 text-primary-600 hover:text-primary-700"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-3">
              <div
                className="w-4 h-4 rounded-full shadow-sm"
                style={{ backgroundColor: board.color }}
              />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">{board.name}</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Create Post Form - Always visible on left */}
          <div className="lg:col-span-1">
            <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-primary-200 p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Suggest a feature</h3>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Short, descriptive title
                  </label>
                  <input
                    type="text"
                    value={newPostTitle}
                    onChange={(e) => setNewPostTitle(e.target.value)}
                    placeholder="probando login"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm transition-all duration-200 bg-white/80"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newPostDescription}
                    onChange={(e) => setNewPostDescription(e.target.value)}
                    placeholder="The login button color should be green to match our brand colors."
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none text-sm transition-all duration-200 bg-white/80"
                  />
                </div>
                
                {session ? (
                  <button
                    onClick={createPost}
                    disabled={isCreating || !newPostTitle.trim()}
                    className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 disabled:from-gray-300 disabled:to-gray-400 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:transform-none text-sm"
                  >
                    {isCreating ? 'Creating...' : 'Create Post'}
                  </button>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-sm text-gray-600 mb-3">You must be logged in to suggest features</p>
                    <button
                      onClick={() => router.push('/auth/signin')}
                      className="text-primary-600 hover:text-primary-700 font-semibold text-sm transition-colors duration-200"
                    >
                      Sign in to get started
                    </button>
                  </div>
                )}
              </div>
              
              <div className="mt-6 pt-4 border-t border-primary-200 text-center">
                <p className="text-xs text-gray-500">Powered by <span className="font-semibold text-primary-600">Reevio</span></p>
              </div>
            </div>
          </div>

          {/* Posts List */}
          <div className="lg:col-span-2">
            {posts.length === 0 ? (
              <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-primary-200 p-8 text-center shadow-lg">
                <MessageSquare className="w-16 h-16 text-primary-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">No posts yet</h3>
                <p className="text-gray-600 mb-4">Be the first to suggest a feature for this board!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {posts.map((post) => {
                  const userVote = getUserVoteForPost(post.id);
                  return (
                    <div key={post.id} className="bg-white/90 backdrop-blur-sm rounded-xl border border-primary-200 p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                      <div className="flex items-start space-x-4">
                        {/* Vote buttons */}
                        <div className="flex flex-col items-center space-y-2 bg-gradient-to-b from-primary-50 to-primary-100 rounded-xl p-3 shadow-sm">
                          <button
                            onClick={() => session ? vote(post.id.toString(), 1) : router.push('/auth/signin')}
                            className={`p-2 rounded-lg transition-all duration-200 ${
                              userVote === 1
                                ? 'text-white bg-gradient-to-r from-primary-600 to-primary-700 shadow-md transform scale-110'
                                : 'text-primary-400 hover:text-primary-600 hover:bg-primary-200 hover:scale-105'
                            }`}
                          >
                            <ChevronUp className="w-5 h-5" />
                          </button>
                          <span className="text-xl font-bold text-gray-900 px-2">
                            {post.votes_count}
                          </span>
                          <button
                            onClick={() => session ? vote(post.id.toString(), -1) : router.push('/auth/signin')}
                            className={`p-2 rounded-lg transition-all duration-200 ${
                              userVote === -1
                                ? 'text-white bg-gradient-to-r from-red-500 to-red-600 shadow-md transform scale-110'
                                : 'text-gray-400 hover:text-red-500 hover:bg-red-50 hover:scale-105'
                            }`}
                          >
                            <ChevronDown className="w-5 h-5" />
                          </button>
                        </div>
                        
                        {/* Post content */}
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight">
                            {post.title}
                          </h3>
                          {post.description && (
                            <p className="text-gray-700 mb-4 leading-relaxed">{post.description}</p>
                          )}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center text-sm text-gray-500">
                              <span className="font-medium">by {post.profiles.name}</span>
                              <span className="mx-1">•</span>
                              <span>{formatTimeAgo(post.created_at)}</span>
                            </div>
                            <button
                              onClick={() => toggleComments(post.id)}
                              className="flex items-center space-x-2 px-3 py-2 text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-all duration-200 font-medium"
                            >
                              <MessageSquare className="w-5 h-5" />
                              <span>
                                {showComments[post.id] 
                                  ? `Hide ${commentsCount[post.id] || 0} comments`
                                  : `Show all ${commentsCount[post.id] || 0} comments`
                                }
                              </span>
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      {/* Comments Section */}
                      {showComments[post.id] && (
                        <div className="mt-6 pt-6 border-t border-primary-200">
                          {/* Add Comment Form */}
                          {session ? (
                            <div className="mb-6">
                              <div className="flex space-x-3">
                                <input
                                  type="text"
                                  value={newComment[post.id] || ''}
                                  onChange={(e) => setNewComment(prev => ({ ...prev, [post.id]: e.target.value }))}
                                  placeholder="Add a comment..."
                                  className="flex-1 px-4 py-3 border border-primary-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white/80 backdrop-blur-sm shadow-sm"
                                  onKeyPress={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                      e.preventDefault();
                                      createComment(post.id);
                                    }
                                  }}
                                />
                                <button
                                  onClick={() => createComment(post.id)}
                                  disabled={isCreatingComment[post.id] || !newComment[post.id]?.trim()}
                                  className="px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 disabled:from-gray-300 disabled:to-gray-400 text-white rounded-xl text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
                                >
                                  {isCreatingComment[post.id] ? 'Adding...' : 'Add'}
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="mb-6 p-4 bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl text-center border border-primary-200">
                              <p className="text-gray-700">
                                <button
                                  onClick={() => router.push('/auth/signin')}
                                  className="text-primary-600 hover:text-primary-700 font-semibold underline decoration-2 underline-offset-2"
                                >
                                  Sign in
                                </button>
                                {' '}to add a comment
                              </p>
                            </div>
                          )}
                          
                          {/* Comments List */}
                          <div className="space-y-4">
                            {comments[post.id]?.length === 0 ? (
                              <p className="text-sm text-gray-500 text-center py-6 bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl border border-primary-200">No comments yet. Be the first to comment!</p>
                            ) : (
                              comments[post.id]?.map((comment) => (
                                <div key={comment.id} className="bg-gradient-to-r from-primary-50 to-white rounded-xl p-4 border border-primary-200 shadow-sm hover:shadow-md transition-all duration-200">
                                  <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center text-xs text-gray-600">
                                      <span className="font-semibold text-primary-700">{comment.profiles.name}</span>
                                      <span className="mx-2 text-primary-400">•</span>
                                      <span>{formatTimeAgo(comment.created_at)}</span>
                                    </div>
                                  </div>
                                  <p className="text-sm text-gray-800 leading-relaxed">{comment.content}</p>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoardPage;