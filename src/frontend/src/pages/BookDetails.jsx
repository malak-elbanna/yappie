import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import API from '../Stream';
import axios from 'axios';
import { saveChapter, getChapter, isChapterDownloaded } from '../utils/download';

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

  const handlePlay = async (audioRef, index) => {
    if (positions[index]) {
      audioRef.current.currentTime = positions[index];
    }

    if (isOffline) {
      const offlineUrl = await loadOfflineChapter(index);
      if (offlineUrl) {
        audioRef.current.src = offlineUrl;
      } else {
        alert('This chapter is not available offline.');
      }
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

  return (
    <div className="p-4">
      {book ? (
        <>
          <h2 className="text-3xl font-bold">{book.title}</h2>
          <p className="text-gray-600">{book.author}</p>
          <p>{book.description}</p>

          {reviewSummary && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-semibold">Reviews</h3>
              <div className="flex items-center mt-2">
                <span className="text-2xl font-bold">{reviewSummary.averageRating}</span>
                <span className="ml-2 text-gray-600">({reviewSummary.totalReviews} reviews)</span>
              </div>
            </div>
          )}

          <div className="mt-6 p-4 bg-white rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-4">Write a Review</h3>
            <form onSubmit={handleSubmitReview}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Rating</label>
                <select
                  value={newReview.rating}
                  onChange={(e) => setNewReview({ ...newReview, rating: parseInt(e.target.value) })}
                  className="w-full p-2 border rounded"
                >
                  {[5, 4, 3, 2, 1].map(star => (
                    <option key={star} value={star}>{`${star} Star${star > 1 ? 's' : ''}`}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Comment</label>
                <textarea
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  className="w-full p-2 border rounded"
                  rows="3"
                  placeholder="Share your thoughts about this audiobook..."
                />
              </div>
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Submit Review
              </button>
            </form>
          </div>

          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-4">User Reviews</h3>
            {reviews.map((review, index) => (
              <div key={index} className="mb-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center mb-2 text-yellow-500">
                  {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                </div>
                <p className="text-gray-700">{review.comment}</p>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <h3 className="text-xl font-semibold">Chapters</h3>
            {book.chapters.map((chapter, index) => {
              const audioRef = React.createRef();
              return (
                <div key={index} className="mt-4 border-t pt-4">
                  <h4 className="font-medium">{chapter.title}</h4>
                  <audio
                    ref={audioRef}
                    controls
                    src={!isOffline ? chapter.mp3_url : undefined}
                    onPlay={() => handlePlay(audioRef, index)}
                    onPause={() => handleSavePosition(index, audioRef.current?.currentTime || 0)}
                  />
                  {isOffline ? (
                    <button
                      className="bg-gray-500 text-white px-4 py-2 rounded mt-2"
                      onClick={async () => {
                        const offlineUrl = await loadOfflineChapter(index);
                        if (offlineUrl) {
                          audioRef.current.src = offlineUrl;
                          audioRef.current.play();
                        } else {
                          alert('This chapter is not available offline.');
                        }
                      }}
                    >
                      Play Offline
                    </button>
                  ) : (
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
                      onClick={() => handleDownloadChapter(index)}
                    >
                      Download
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <p>Loading book...</p>
      )}
    </div>
  );
};

export default BookDetails;
