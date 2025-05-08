import React, { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import API from '../Stream';
import axios from 'axios';
import { saveChapter, getChapter, isChapterDownloaded } from '../utils/download';

const API_URL = 'http://localhost:8000';
const REVIEW_SERVICE_URL = 'review-service';

const BookDetails = () => {
  const { id } = useParams();
  const { userId } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewSummary, setReviewSummary] = useState(null);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [positions, setPositions] = useState({});
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [activeChapter, setActiveChapter] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAutoPlayEnabled, setIsAutoPlayEnabled] = useState(true);

  const audioRefs = useRef({});

  useEffect(() => {
    const handleOnlineStatus = () => setIsOffline(!navigator.onLine);
    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);
    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, []);

  useEffect(() => {
    if (!isOffline) {
      API.get(`/books/${id}`)
        .then(res => setBook(res.data))
        .catch(console.error);

      axios.get(`${API_URL}/${REVIEW_SERVICE_URL}/reviews/${id}`)
        .then(res => setReviews(res.data))
        .catch(console.error);

      axios.get(`${API_URL}/${REVIEW_SERVICE_URL}/reviews/${id}/summary`)
        .then(res => setReviewSummary(res.data))
        .catch(console.error);
    }
  }, [id, isOffline]);

  const loadOfflineChapter = async (index) => {
    const key = `${id}-${index}`;
    const isDownloaded = await isChapterDownloaded(key);
    if (isDownloaded) {
      const blob = await getChapter(key);
      return URL.createObjectURL(blob);
    }
    return null;
  };

  const handlePlay = async (index) => {
    if (activeChapter !== null && audioRefs.current[activeChapter]) {
      audioRefs.current[activeChapter].pause();
    }
    
    setActiveChapter(index);
    setIsPlaying(true);

    if (!audioRefs.current[index]) {
      return;
    }

    if (positions[index]) {
      audioRefs.current[index].currentTime = positions[index];
    }

    if (isOffline) {
      const offlineUrl = await loadOfflineChapter(index);
      if (offlineUrl) {
        audioRefs.current[index].src = offlineUrl;
        try {
          await audioRefs.current[index].play();
        } catch (err) {
          console.error('Error playing audio:', err);
          setIsPlaying(false);
        }
      } else {
        alert('This chapter is not available offline.');
        setIsPlaying(false);
      }
    } else {
      try {
        await audioRefs.current[index].play();
      } catch (err) {
        console.error('Error playing audio:', err);
        setIsPlaying(false);
      }
    }
  };
  
  const handleAutoPlayNext = (currentIndex) => {
    if (isAutoPlayEnabled && currentIndex < book.chapters.length - 1) {
      handlePlay(currentIndex + 1);
    } else {
      console.log('End of book reached');
      setIsPlaying(false);
    }
  };
  
  const handleSeek = (index, e) => {
    if (!audioRefs.current[index]) return;
    
    const progressBar = e.currentTarget;
    const bounds = progressBar.getBoundingClientRect();
    const x = e.clientX - bounds.left;
    const width = bounds.width;
    const percentage = x / width;
    
    const seekTime = percentage * audioRefs.current[index].duration;
    
    audioRefs.current[index].currentTime = seekTime;
    
    setPositions(prev => ({ ...prev, [index]: seekTime }));
  };

  const handlePause = (index) => {
    if (audioRefs.current[index]) {
      audioRefs.current[index].pause();
      const currentPosition = audioRefs.current[index].currentTime;
      setIsPlaying(false);
      handleSavePosition(index, currentPosition);
    }
  };

  const handleDownloadChapter = async (index) => {
    try {
      const chapter = book.chapters[index];
      const key = `${id}-${index}`;
      const response = await API.get(`/download/${id}/${index}`, {
        responseType: 'blob',
      });
      await saveChapter(key, response.data);
      alert(`Chapter "${chapter.title}" downloaded successfully.`);
    } catch (err) {
      console.error('Error downloading chapter:', err);
      alert('Failed to download chapter.');
    }
  };

  const handleSavePosition = (index, position) => {
    console.log('Saving position:', { userId, bookId: id, index, position });
    const newPositions = { ...positions, [index]: position };
    setPositions(newPositions);
    API.post(`/playback/${userId}/${id}/${index}`, { position }).catch(console.error);
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    axios.post(`${API_URL}/${REVIEW_SERVICE_URL}/reviews`, {
      audiobookId: id,
      userId,
      rating: newReview.rating,
      comment: newReview.comment,
    })
      .then(() => {
        axios.get(`${API_URL}/${REVIEW_SERVICE_URL}/reviews/${id}`).then(res => setReviews(res.data));
        axios.get(`${API_URL}/${REVIEW_SERVICE_URL}/reviews/${id}/summary`).then(res => setReviewSummary(res.data));
        setNewReview({ rating: 5, comment: '' });
      })
      .catch(console.error);
  };

  const renderStars = (rating) => {
    return (
      <div className="flex text-yellow-400">
        {[...Array(5)].map((_, i) => (
          <span key={i} className={`text-xl ${i < rating ? 'text-yellow-400' : 'text-gray-400'}`}>
            ★
          </span>
        ))}
      </div>
    );
  };

  if (!book) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-800 text-white flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-64 bg-gray-700 rounded-lg mb-8"></div>
          <div className="h-6 w-48 bg-gray-700 rounded-lg mb-4"></div>
          <div className="h-24 w-96 bg-gray-700 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-800 text-white relative overflow-x-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-72 bg-purple-700 opacity-25 blur-3xl rounded-full pointer-events-none z-0" />
      
      <div className="container mx-auto px-6 py-12 relative z-10">
        <Link to="/books" className="inline-flex items-center text-purple-400 hover:text-purple-300 mb-6 transition">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Library
        </Link>
      
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
          
          {/* book info */}
          <div className="md:col-span-1 lg:col-span-2">
            <div className="bg-gray-800 bg-opacity-40 backdrop-blur-md rounded-2xl shadow-lg p-6 mb-8">
              <h1 className="text-4xl font-extrabold mb-2 drop-shadow-lg">{book.title}</h1>
              <p className="text-xl text-purple-400 mb-4">{book.author}</p>
              <p className="text-gray-300 mb-6 leading-relaxed">{book.description}</p>
              
              {reviewSummary && (
                <div className="flex items-center mb-4">
                  {renderStars(reviewSummary.averageRating)}
                  <span className="ml-3 text-xl font-bold">{reviewSummary.averageRating.toFixed(1)}</span>
                  <span className="ml-2 text-gray-400">({reviewSummary.totalReviews} reviews)</span>
                </div>
              )}
              
              <div className="flex flex-col sm:flex-row gap-4">
                <div className={`p-4 rounded-xl flex-1 ${isOffline ? 'bg-red-900 bg-opacity-30' : 'bg-green-900 bg-opacity-30'}`}>
                  <div className="flex items-center">
                    <span className={`h-3 w-3 rounded-full mr-2 ${isOffline ? 'bg-red-500' : 'bg-green-500'}`}></span>
                    <p className="font-medium">{isOffline ? 'Offline Mode' : 'Online Mode'}</p>
                  </div>
                  <p className="text-sm mt-1 text-gray-300">
                    {isOffline 
                      ? 'You can play downloaded chapters in offline mode.' 
                      : 'Stream chapters online or download them for offline listening.'}
                  </p>
                </div>
                
                <div className="p-4 rounded-xl flex-1 bg-purple-900 bg-opacity-30">
                  <div className="flex items-center">
                    <span className={`h-3 w-3 rounded-full mr-2 ${isAutoPlayEnabled ? 'bg-purple-500' : 'bg-gray-500'}`}></span>
                    <p className="font-medium">Auto-Play</p>
                    <label className="relative inline-flex items-center cursor-pointer ml-2">
                      <input 
                        type="checkbox" 
                        checked={isAutoPlayEnabled}
                        onChange={() => setIsAutoPlayEnabled(!isAutoPlayEnabled)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-purple-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>
                  <p className="text-sm mt-1 text-gray-300">
                    {isAutoPlayEnabled 
                      ? 'Chapters will play automatically one after another.' 
                      : 'Auto-play is disabled. Chapters must be played manually.'}
                  </p>
                </div>
              </div>
            </div>

            {/* chapters */}
            <div className="bg-gray-800 bg-opacity-40 backdrop-blur-md rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                Chapters
              </h2>
              
              {book.chapters.map((chapter, index) => {
                const isActive = activeChapter === index;
                
                return (
                  <div 
                    key={index} 
                    className={`mb-6 p-4 rounded-xl transition-all duration-300 ${
                      isActive 
                        ? 'bg-purple-900 bg-opacity-40 shadow-md shadow-purple-900/50' 
                        : 'bg-gray-800 bg-opacity-60 hover:bg-opacity-80'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 gap-2">
                      <h3 className="font-semibold text-lg">{chapter.title}</h3>
                      <div className="flex flex-wrap gap-2">
                        {isOffline ? (
                          <button
                            className={`px-4 py-1.5 rounded-full text-sm font-medium flex items-center ${
                              isActive && isPlaying
                                ? 'bg-red-600 hover:bg-red-700'
                                : 'bg-purple-600 hover:bg-purple-500'
                            } transition`}
                            onClick={() => {
                              if (isActive && isPlaying) {
                                handlePause(index);
                              } else {
                                handlePlay(index);
                              }
                            }}
                          >
                            {isActive && isPlaying ? (
                              <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Pause
                              </>
                            ) : (
                              <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Play Offline
                              </>
                            )}
                          </button>
                        ) : (
                          <>
                            <button
                              className={`px-4 py-1.5 rounded-full text-sm font-medium flex items-center ${
                                isActive && isPlaying
                                  ? 'bg-red-600 hover:bg-red-700'
                                  : 'bg-purple-600 hover:bg-purple-500'
                              } transition`}
                              onClick={() => {
                                if (isActive && isPlaying) {
                                  handlePause(index);
                                } else {
                                  handlePlay(index);
                                }
                              }}
                            >
                              {isActive && isPlaying ? (
                                <>
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  Pause
                                </>
                              ) : (
                                <>
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  Play
                                </>
                              )}
                            </button>
                            <button
                              className="bg-pink-600 hover:bg-pink-500 px-4 py-1.5 rounded-full text-sm font-medium flex items-center transition"
                              onClick={() => handleDownloadChapter(index)}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                              </svg>
                              Download
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                    
                    {isActive && (
                      <div 
                        className="mt-3 w-full bg-gray-700 bg-opacity-50 rounded-full h-2 overflow-hidden cursor-pointer"
                        onClick={(e) => handleSeek(index, e)}
                      >
                        <div 
                          className="bg-gradient-to-r from-purple-500 to-pink-500 h-full transition-all duration-300"
                          style={{ width: `${positions[index] ? (positions[index] / (audioRefs.current[index]?.duration || 1)) * 100 : 0}%` }}
                        ></div>
                      </div>
                    )}
                    
                    {/* player controls */}
                    {isActive && (
                      <div className="mt-4 flex items-center justify-between">
                        <div className="text-xs text-gray-400">
                          {positions[index] ? 
                            new Date(positions[index] * 1000).toISOString().substr(14, 5) : 
                            "00:00"}
                        </div>
                        
                        <div className="flex space-x-2">
                          <button 
                            className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 transition"
                            onClick={() => {
                              if (audioRefs.current[index]) {
                                const newTime = Math.max(0, audioRefs.current[index].currentTime - 10);
                                audioRefs.current[index].currentTime = newTime;
                                setPositions(prev => ({ ...prev, [index]: newTime }));
                              }
                            }}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.333 4zM4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.334 4z" />
                            </svg>
                          </button>
                          
                          <button 
                            className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 transition"
                            onClick={() => {
                              if (audioRefs.current[index]) {
                                const newTime = Math.min(
                                  audioRefs.current[index].duration, 
                                  audioRefs.current[index].currentTime + 10
                                );
                                audioRefs.current[index].currentTime = newTime;
                                setPositions(prev => ({ ...prev, [index]: newTime }));
                              }
                            }}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.933 12.8a1 1 0 000-1.6L6.6 7.2A1 1 0 005 8v8a1 1 0 001.6.8l5.333-4zM19.933 12.8a1 1 0 000-1.6l-5.333-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.333-4z" />
                            </svg>
                          </button>
                          
                          <select
                            className="bg-gray-700 text-xs rounded-md p-1 focus:outline-none focus:ring focus:ring-purple-500"
                            onChange={(e) => {
                              if (audioRefs.current[index]) {
                                audioRefs.current[index].playbackRate = parseFloat(e.target.value);
                              }
                            }}
                            defaultValue="1"
                          >
                            <option value="0.5">0.5x</option>
                            <option value="0.75">0.75x</option>
                            <option value="1">1x</option>
                            <option value="1.25">1.25x</option>
                            <option value="1.5">1.5x</option>
                            <option value="2">2x</option>
                          </select>
                        </div>
                        
                        <div className="text-xs text-gray-400">
                          {audioRefs.current[index]?.duration ? 
                            new Date(audioRefs.current[index].duration * 1000).toISOString().substr(14, 5) : 
                            "--:--"}
                        </div>
                      </div>
                    )}
                    
                    <audio
                      ref={el => audioRefs.current[index] = el}
                      src={!isOffline ? chapter.mp3_url : undefined}
                      onPlay={() => setIsPlaying(true)}
                      onPause={() => setIsPlaying(false)}
                      onTimeUpdate={() => {
                        if (audioRefs.current[index]) {
                          setPositions(prev => ({ 
                            ...prev, 
                            [index]: audioRefs.current[index].currentTime 
                          }));
                        }
                      }}
                      onEnded={() => {
                        handleSavePosition(index, audioRefs.current[index]?.duration || 0);
                        handleAutoPlayNext(index);
                      }}
                    />
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* reviews */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 bg-opacity-40 backdrop-blur-md rounded-2xl shadow-lg p-6 mb-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
                Write a Review
              </h2>
              
              <form onSubmit={handleSubmitReview} className="mb-8">
                <div className="mb-4">
                  <label className="block text-gray-300 mb-2 font-medium">Rating</label>
                  <div className="flex space-x-1">
                    {[5, 4, 3, 2, 1].map(star => (
                      <button
                        type="button"
                        key={star}
                        className="text-2xl focus:outline-none"
                        onClick={() => setNewReview({ ...newReview, rating: star })}
                      >
                        <span className={star <= newReview.rating ? 'text-yellow-400' : 'text-gray-500'}>
                          ★
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-300 mb-2 font-medium">Your Thoughts</label>
                  <textarea
                    value={newReview.comment}
                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                    className="w-full p-3 bg-gray-700 bg-opacity-50 text-white rounded-xl border border-gray-600 focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-40 focus:outline-none transition"
                    rows="4"
                    placeholder="Share your thoughts about this audiobook..."
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-medium px-4 py-2.5 rounded-xl shadow-lg hover:shadow-pink-600/30 transition duration-300"
                >
                  Submit Review
                </button>
              </form>
              
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
                User Reviews
              </h2>
              
              <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {reviews.length === 0 ? (
                  <p className="text-center text-gray-400 italic py-6">No reviews yet. Be the first to review!</p>
                ) : (
                  reviews.map((review, index) => (
                    <div key={index} className="p-4 bg-gray-700 bg-opacity-40 rounded-xl hover:bg-opacity-60 transition">
                      {renderStars(review.rating)}
                      <p className="mt-2 text-gray-300">{review.comment}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;