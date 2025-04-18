import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import API from '../Stream';
import axios from 'axios';

const REVIEW_SERVICE_URL = 'http://localhost:5003';

const BookDetails = () => {
  const { id } = useParams();
  const { userId } = useAuth();

  const [book, setBook] = useState(null);
  const [positions, setPositions] = useState({});
  // const [currentAudio, setCurrentAudio] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewSummary, setReviewSummary] = useState(null);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });

  useEffect(() => {
    API.get(`/books/${id}`)
      .then(res => setBook(res.data))
      .catch(err => console.error(err));

    axios.get(`${REVIEW_SERVICE_URL}/reviews/${id}`)
      .then(res => setReviews(res.data))
      .catch(err => console.error(err));

    axios.get(`${REVIEW_SERVICE_URL}/reviews/${id}/summary`)
      .then(res => setReviewSummary(res.data))
      .catch(err => console.error(err));
  }, [id]);

  useEffect(() => {
    if (book?.chapters?.length) {
      book.chapters.forEach((_, i) => {
        API.get(`/playback/${userId}/${id}/${i}`).then(res => {
          setPositions(prev => ({ ...prev, [i]: res.data.playback_position || 0 }));
        });
      });
    }
  }, [book, id, userId]);

  const handleSavePosition = (index, position) => {
    API.post(`/playback/${userId}/${id}/${index}`, { position }).catch(console.error);
  };

  const handlePlay = (audioRef, index) => {
    if (positions[index]) {
      audioRef.current.currentTime = positions[index];
    }
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    axios.post(`${REVIEW_SERVICE_URL}/reviews`, {
      audiobookId: id,
      userId,
      rating: newReview.rating,
      comment: newReview.comment
    })
      .then(() => {
        axios.get(`${REVIEW_SERVICE_URL}/reviews/${id}`)
          .then(res => setReviews(res.data))
          .catch(err => console.error(err));

        axios.get(`${REVIEW_SERVICE_URL}/reviews/${id}/summary`)
          .then(res => setReviewSummary(res.data))
          .catch(err => console.error(err));

        setNewReview({ rating: 5, comment: '' });
      })
      .catch(err => console.error(err));
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
                  <option value="5">5 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="3">3 Stars</option>
                  <option value="2">2 Stars</option>
                  <option value="1">1 Star</option>
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
                <div className="flex items-center mb-2">
                  <span className="text-yellow-500">
                    {'★'.repeat(review.rating)}
                    {'☆'.repeat(5 - review.rating)}
                  </span>
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
                    src={chapter.mp3_url}
                    onPlay={() => handlePlay(audioRef, index)}
                    onPause={() =>
                      handleSavePosition(index, audioRef.current?.currentTime || 0)
                    }
                  />
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
