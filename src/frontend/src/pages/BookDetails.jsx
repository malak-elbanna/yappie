import React, { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import API from '../Stream';
import axios from 'axios';
import { saveChapter, getChapter, isChapterDownloaded } from '../utils/download';
import BookInfoSection from '../components/BookInfoSection';
import ChaptersList from '../components/ChapterList';
import ReviewSection from '../components/ReviewSection';
import { addFavoriteBook, getFavoriteBooks } from '../Api';
import AudioHLS from '../components/AudioHLS'

const API_URL = 'http://localhost:8000';
const REVIEW_SERVICE_URL = 'review-service';

const BookDetails = () => {
  const { id } = useParams();
  const { userId } = useAuth();
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewSummary, setReviewSummary] = useState(null);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [positions, setPositions] = useState({});
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [activeChapter, setActiveChapter] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAutoPlayEnabled, setIsAutoPlayEnabled] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

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

  useEffect(() => {
    const checkIfFavorite = async () => {
      if (userId && book?.cover_url) {
        try {
          const favoriteBooks = await getFavoriteBooks(userId);
          const isFav = favoriteBooks.includes(book.cover_url)
          console.log("is fav is", isFav);
          setIsFavorite(isFav);
        } catch (error) {
          console.error("Error checking favorite status: ", error);
        }
      }
    };
  
    checkIfFavorite();
  }, [userId, book?.cover_url]);  

  const handleAddFavorite = async() => {
    try {
      await addFavoriteBook(userId, book.cover_url);
      setIsFavorite(true);
    } catch (error) {
      console.error("Error adding favorite book", error);
    }
  };

  const handleToggleFavorite = async () => {
    if (!isFavorite) {
      handleAddFavorite();
    } else {
      setIsFavorite(false);
    }
  }
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
      
      <div className="container mx-auto px-4 sm:px-6 py-8 relative z-10">
        <header className="mb-8">
          <Link to="/books" className="inline-flex items-center text-purple-400 hover:text-purple-300 transition group">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Library
          </Link>
        </header>
      
        <div className="flex flex-col lg:flex-row gap-8">

          <div className="lg:w-2/3 flex flex-col gap-8">
            <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6 backdrop-blur-sm shadow-lg border border-gray-700">
              <BookInfoSection 
                book={book} 
                reviewSummary={reviewSummary} 
                isOffline={isOffline} 
                isAutoPlayEnabled={isAutoPlayEnabled} 
                setIsAutoPlayEnabled={setIsAutoPlayEnabled} 
                isFavorite={isFavorite}
                onToggleFavorite={handleToggleFavorite}
              />
            </div>
            
            <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6 backdrop-blur-sm shadow-lg border border-gray-700">
              <h2 className="text-xl font-bold mb-4 text-purple-300">Chapters</h2>
              {book.chapters && <ChaptersList 
                book={book}
                isOffline={isOffline}
                activeChapter={activeChapter}
                isPlaying={isPlaying}
                positions={positions}
                audioRefs={audioRefs}
                handlePlay={handlePlay}
                handlePause={handlePause}
                handleDownloadChapter={handleDownloadChapter}
                handleSeek={handleSeek}
                handleSavePosition={handleSavePosition}
                handleAutoPlayNext={handleAutoPlayNext}
                setPositions={setPositions}
                setIsPlaying={setIsPlaying}
              />}
              {book.audio_url && <AudioHLS source = {book.audio_url}/>}
            </div>
          </div>
          
          <div className="lg:w-1/3">
            <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6 backdrop-blur-sm shadow-lg border border-gray-700">
              <h2 className="text-xl font-bold mb-4 text-purple-300">Reviews</h2>
              <ReviewSection 
                reviews={reviews}
                newReview={newReview}
                setNewReview={setNewReview}
                handleSubmitReview={handleSubmitReview}
              />
            </div>
          </div>
        </div>
        
        <footer className="mt-16 pt-8 border-t border-gray-700 text-center text-gray-400 text-sm">
          <p>© {new Date().getFullYear()} Audiobook Stream. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default BookDetails;
