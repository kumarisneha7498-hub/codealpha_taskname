import React, { useState, useEffect } from 'react';
import { mockService } from './services/mockBackend';
import { generatePostCaption, enhanceBio } from './services/geminiService';
import { User, Post } from './types';
import Sidebar from './components/Sidebar';
import MobileNav from './components/MobileNav';
import PostCard from './components/PostCard';
import Header from './components/Header';
import { Loader2, Sparkles, Image as ImageIcon, X, Camera, LogIn, Save, PlusSquare } from 'lucide-react';

const App: React.FC = () => {
  // --- State ---
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState('feed'); // 'login', 'feed', 'explore', 'create', 'profile', 'settings'
  const [viewingProfile, setViewingProfile] = useState<string | null>(null); // username
  
  // Data State
  const [feedPosts, setFeedPosts] = useState<Post[]>([]);
  const [profileData, setProfileData] = useState<{ user: User, posts: Post[] } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Create Post State
  const [newPostContent, setNewPostContent] = useState('');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [showAiModal, setShowAiModal] = useState(false);

  // Settings State
  const [settingsBio, setSettingsBio] = useState('');
  const [isEnhancingBio, setIsEnhancingBio] = useState(false);

  // Auth State
  const [loginUsername, setLoginUsername] = useState('');
  const [signupName, setSignupName] = useState('');
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  // --- Effects ---

  // Initial Load (Auto Login Simulation)
  useEffect(() => {
    // In a real app, check localStorage token
    // For demo, we start at login screen
    setCurrentPage('login');
  }, []);

  // Fetch Feed when page changes to feed
  useEffect(() => {
    if (currentUser && currentPage === 'feed') {
      loadFeed();
    } else if (currentUser && currentPage === 'explore') {
        loadExplore();
    }
  }, [currentUser, currentPage]);

  // Fetch Profile when viewingProfile changes
  useEffect(() => {
    if (currentUser && viewingProfile) {
      loadProfile(viewingProfile);
    }
  }, [viewingProfile, currentUser]);

  // Load settings data
  useEffect(() => {
    if (currentUser && currentPage === 'settings') {
        setSettingsBio(currentUser.bio);
    }
  }, [currentUser, currentPage]);

  // --- Actions ---

  const loadFeed = async () => {
    if (!currentUser) return;
    setIsLoading(true);
    try {
      const posts = await mockService.getFeed(currentUser.id);
      setFeedPosts(posts);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadExplore = async () => {
      setIsLoading(true);
      try {
          const posts = await mockService.getAllPosts();
          setFeedPosts(posts);
      } catch (err) {
          console.error(err);
      } finally {
          setIsLoading(false);
      }
  }

  const loadProfile = async (username: string) => {
    setIsLoading(true);
    try {
      const data = await mockService.getUserProfile(username);
      setProfileData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      let user;
      if (authMode === 'login') {
        user = await mockService.login(loginUsername);
      } else {
        user = await mockService.signup(signupName, loginUsername);
      }

      if (user) {
        setCurrentUser(user);
        setCurrentPage('feed');
        // If it's a new signup, user is u{timestamp}
      } else {
        alert("User not found. Try 'tech_guru' or sign up.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePost = async () => {
    if (!currentUser || !newPostContent.trim()) return;
    setIsLoading(true);
    try {
      // Random image for demo effect sometimes
      const randomImage = Math.random() > 0.7 ? `https://picsum.photos/seed/${Date.now()}/800/600` : undefined;
      await mockService.createPost(currentUser.id, newPostContent, randomImage);
      setNewPostContent('');
      setCurrentPage('feed'); // Go back to feed
      loadFeed(); // Refresh
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAiGenerate = async () => {
    if (!aiPrompt.trim()) return;
    setIsGeneratingAI(true);
    try {
      const caption = await generatePostCaption(aiPrompt);
      setNewPostContent(caption);
      setShowAiModal(false);
      setAiPrompt('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleEnhanceBio = async () => {
      if (!settingsBio.trim()) return;
      setIsEnhancingBio(true);
      try {
          const enhanced = await enhanceBio(settingsBio);
          setSettingsBio(enhanced);
      } catch (err) {
          console.error(err);
      } finally {
          setIsEnhancingBio(false);
      }
  };

  const handleSaveSettings = async () => {
      if (!currentUser) return;
      setIsLoading(true);
      try {
          await mockService.updateUserBio(currentUser.id, settingsBio);
          setCurrentUser({ ...currentUser, bio: settingsBio });
          alert('Profile updated!');
      } catch (err) {
          console.error(err);
      } finally {
          setIsLoading(false);
      }
  };

  const handleFollowToggle = async () => {
      if(!currentUser || !profileData) return;
      
      // Optimistic update
      const targetId = profileData.user.id;
      const isFollowing = currentUser.following.includes(targetId);
      
      // Update local current user state
      const updatedFollowing = isFollowing 
        ? currentUser.following.filter(id => id !== targetId)
        : [...currentUser.following, targetId];
        
      setCurrentUser({...currentUser, following: updatedFollowing});
      
      // Update local profile view state (followers count)
      const updatedFollowers = isFollowing
        ? profileData.user.followers.filter(id => id !== currentUser.id)
        : [...profileData.user.followers, currentUser.id];
        
      setProfileData({
          ...profileData,
          user: { ...profileData.user, followers: updatedFollowers }
      });

      await mockService.toggleFollow(currentUser.id, targetId);
  }

  const navigateToProfile = (username: string) => {
      setViewingProfile(username);
      setCurrentPage('profile');
  };

  // --- Render Helpers ---

  const renderLogin = () => (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex justify-center mb-6">
            <div className="bg-indigo-100 p-3 rounded-full">
                <Camera className="w-8 h-8 text-primary" />
            </div>
        </div>
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">SocialSphere</h2>
        <p className="text-center text-gray-500 mb-8">Connect, Share, Inspire.</p>

        <form onSubmit={handleAuth} className="space-y-4">
          {authMode === 'signup' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                value={signupName}
                onChange={(e) => setSignupName(e.target.value)}
                placeholder="John Doe"
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              type="text"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              value={loginUsername}
              onChange={(e) => setLoginUsername(e.target.value)}
              placeholder="tech_guru"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-primary hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-lg transition-transform transform hover:scale-[1.02] active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : (authMode === 'login' ? 'Log In' : 'Sign Up')}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          {authMode === 'login' ? (
            <p>
              Don't have an account?{' '}
              <button onClick={() => setAuthMode('signup')} className="text-primary font-semibold hover:underline">
                Sign up
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button onClick={() => setAuthMode('login')} className="text-primary font-semibold hover:underline">
                Log in
              </button>
            </p>
          )}
        </div>
        
        {authMode === 'login' && (
             <div className="mt-6 p-4 bg-gray-50 rounded text-xs text-gray-500 text-center">
                 <p>Try demo user: <strong>tech_guru</strong></p>
             </div>
        )}
      </div>
    </div>
  );

  const renderCreatePost = () => (
    <div className="max-w-2xl mx-auto p-4 md:pt-10">
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Create New Post</h2>
        
        <div className="relative mb-4">
            <textarea
            className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-primary outline-none resize-none h-40"
            placeholder="What's on your mind?"
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
            ></textarea>
            
            <button 
                onClick={() => setShowAiModal(true)}
                className="absolute right-3 bottom-3 flex items-center space-x-1 text-xs bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-3 py-1.5 rounded-full hover:shadow-lg transition-all"
            >
                <Sparkles className="w-3 h-3" />
                <span>AI Magic</span>
            </button>
        </div>

        <div className="flex justify-between items-center">
          <button className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100">
            <ImageIcon className="w-6 h-6" />
          </button>
          
          <div className="flex space-x-3">
            <button 
                onClick={() => setCurrentPage('feed')}
                className="px-6 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
            >
                Cancel
            </button>
            <button 
                onClick={handleCreatePost}
                disabled={!newPostContent.trim() || isLoading}
                className="px-6 py-2 bg-primary text-white font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-sm"
            >
                {isLoading ? 'Posting...' : 'Post'}
            </button>
          </div>
        </div>
      </div>

      {/* AI Modal */}
      {showAiModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold flex items-center text-gray-800">
                    <Sparkles className="w-5 h-5 text-purple-500 mr-2" />
                    Generate with Gemini
                </h3>
                <button onClick={() => setShowAiModal(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <p className="text-sm text-gray-600 mb-3">What is your post about?</p>
            <input 
                type="text"
                autoFocus
                className="w-full border border-gray-300 rounded-lg p-3 focus:border-purple-500 outline-none mb-4"
                placeholder="e.g., A beautiful sunrise in the mountains..."
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
            />
            <button 
                onClick={handleAiGenerate}
                disabled={isGeneratingAI || !aiPrompt}
                className="w-full py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex justify-center items-center font-medium"
            >
                {isGeneratingAI ? <Loader2 className="animate-spin w-5 h-5" /> : 'Generate Caption'}
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const renderProfile = () => {
    if (isLoading && !profileData) {
        return <div className="flex justify-center pt-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
    }

    if (!profileData) return <div className="p-8 text-center text-gray-500">User not found</div>;

    const isOwnProfile = currentUser?.id === profileData.user.id;
    const isFollowing = currentUser?.following.includes(profileData.user.id);

    return (
      <div className="max-w-3xl mx-auto md:p-4">
        <div className="bg-white md:rounded-2xl shadow-sm border-b md:border border-gray-200 overflow-hidden">
            {/* Banner (Fake) */}
            <div className="h-32 md:h-48 bg-gradient-to-r from-blue-400 to-indigo-500"></div>
            
            <div className="px-6 pb-6">
                <div className="flex justify-between items-end -mt-12 md:-mt-16 mb-4">
                    <img 
                        src={profileData.user.avatarUrl} 
                        alt="Profile" 
                        className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white object-cover shadow-md bg-white" 
                    />
                    {!isOwnProfile && (
                        <button 
                            onClick={handleFollowToggle}
                            className={`px-6 py-2 rounded-full font-medium shadow-sm transition-all ${
                                isFollowing 
                                ? 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50' 
                                : 'bg-primary text-white hover:bg-indigo-700'
                            }`}
                        >
                            {isFollowing ? 'Following' : 'Follow'}
                        </button>
                    )}
                    {isOwnProfile && (
                        <button onClick={() => setCurrentPage('settings')} className="px-4 py-2 bg-white border border-gray-300 rounded-full font-medium text-gray-700 hover:bg-gray-50 shadow-sm">
                            Edit Profile
                        </button>
                    )}
                </div>

                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{profileData.user.name}</h1>
                    <p className="text-gray-500 font-medium">@{profileData.user.username}</p>
                </div>

                <p className="mt-4 text-gray-700 leading-relaxed max-w-lg">{profileData.user.bio}</p>

                <div className="flex space-x-6 mt-6 pt-6 border-t border-gray-100">
                    <div className="text-center">
                        <span className="block font-bold text-lg text-gray-900">{profileData.posts.length}</span>
                        <span className="text-gray-500 text-sm">Posts</span>
                    </div>
                    <div className="text-center">
                        <span className="block font-bold text-lg text-gray-900">{profileData.user.followers.length}</span>
                        <span className="text-gray-500 text-sm">Followers</span>
                    </div>
                    <div className="text-center">
                        <span className="block font-bold text-lg text-gray-900">{profileData.user.following.length}</span>
                        <span className="text-gray-500 text-sm">Following</span>
                    </div>
                </div>
            </div>
        </div>

        <div className="mt-6 space-y-6 px-4 md:px-0 pb-20">
            <h3 className="text-lg font-bold text-gray-800 px-1">Posts</h3>
            {profileData.posts.map(post => (
                <PostCard 
                    key={post.id} 
                    post={post} 
                    currentUser={currentUser!}
                    onUserClick={navigateToProfile}
                />
            ))}
            {profileData.posts.length === 0 && (
                <div className="text-center py-10 bg-white rounded-xl border border-dashed border-gray-300">
                    <p className="text-gray-400">No posts yet.</p>
                </div>
            )}
        </div>
      </div>
    );
  };

  const renderFeed = () => (
    <div className="max-w-2xl mx-auto px-4 md:px-0 py-6 pb-20">
      <div className="flex justify-between items-center mb-6 px-2">
          <h1 className="text-2xl font-bold text-gray-900">
              {currentPage === 'explore' ? 'Explore' : 'Home Feed'}
          </h1>
          {currentPage === 'feed' && (
              <button 
                onClick={() => setCurrentPage('create')}
                className="md:hidden bg-primary text-white p-2 rounded-full shadow-lg"
              >
                  <PlusSquare className="w-6 h-6" />
              </button>
          )}
      </div>

      {isLoading && feedPosts.length === 0 ? (
        <div className="flex justify-center pt-20">
            <Loader2 className="w-10 h-10 animate-spin text-primary opacity-50" />
        </div>
      ) : (
        feedPosts.map(post => (
          <PostCard 
            key={post.id} 
            post={post} 
            currentUser={currentUser!} 
            onUserClick={navigateToProfile}
          />
        ))
      )}
      
      {!isLoading && feedPosts.length === 0 && (
          <div className="text-center py-20">
              <p className="text-gray-500 text-lg">Nothing to see here yet.</p>
              {currentPage === 'feed' && <p className="text-gray-400">Follow more people to see their posts!</p>}
          </div>
      )}
    </div>
  );

  const renderSettings = () => (
    <div className="max-w-2xl mx-auto p-4 py-8">
        <h1 className="text-2xl font-bold mb-6 text-gray-900">Settings</h1>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Edit Profile</h2>
                
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                        <input 
                            type="text" 
                            disabled 
                            value={currentUser?.username || ''}
                            className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-500 cursor-not-allowed"
                        />
                        <p className="text-xs text-gray-400 mt-1">Username cannot be changed</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                        <div className="relative">
                            <textarea 
                                value={settingsBio}
                                onChange={(e) => setSettingsBio(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none h-32 resize-none"
                                placeholder="Tell the world about yourself..."
                            />
                            <button 
                                onClick={handleEnhanceBio}
                                disabled={isEnhancingBio || !settingsBio}
                                className="absolute right-3 bottom-3 flex items-center space-x-1 text-xs bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-3 py-1.5 rounded-full hover:shadow-lg transition-all"
                            >
                                {isEnhancingBio ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                                <span>Enhance</span>
                            </button>
                        </div>
                    </div>

                    <div className="flex justify-end pt-2">
                        <button 
                            onClick={handleSaveSettings}
                            disabled={isLoading}
                            className="flex items-center space-x-2 px-6 py-2 bg-primary text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-70"
                        >
                            <Save className="w-4 h-4" />
                            <span>Save Changes</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="p-6 bg-gray-50">
                <div className="flex justify-between items-center">
                    <div>
                        <h3 className="font-medium text-gray-900">App Version</h3>
                        <p className="text-sm text-gray-500">v1.0.0 (Beta)</p>
                    </div>
                    <div className="text-xs text-gray-400">
                        Built with React + Gemini
                    </div>
                </div>
            </div>
        </div>
    </div>
  );

  // --- Main Render ---

  if (currentPage === 'login') return renderLogin();

  const handleNavigate = (page: string) => {
      if (page === 'profile' && currentUser) {
          setViewingProfile(currentUser.username);
      }
      setCurrentPage(page);
      window.scrollTo(0,0);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-gray-900 font-sans">
      <Sidebar 
        currentUser={currentUser} 
        onLogout={() => { setCurrentUser(null); setCurrentPage('login'); }}
        currentPage={currentPage}
        onNavigate={handleNavigate}
      />
      
      <main className="md:ml-64 min-h-screen pb-16 md:pb-0">
        {currentUser && <Header onUserSelect={navigateToProfile} />}

        {currentPage === 'create' ? renderCreatePost() :
         currentPage === 'profile' ? renderProfile() :
         currentPage === 'settings' ? renderSettings() :
         renderFeed()}
      </main>

      <MobileNav currentPage={currentPage} onNavigate={handleNavigate} />
    </div>
  );
};

export default App;