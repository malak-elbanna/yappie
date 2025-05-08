const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');

jest.setTimeout(10000); // Increase timeout to 10 seconds

jest.mock('../backend/review-service/models/Review');
jest.mock('../backend/review-service/logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
}));

const reviewRoutes = require('../backend/review-service/routes/reviews');
const Review = require('../backend/review-service/models/Review'); // Corrected path

const app = express();
app.use(express.json());
app.use('/reviews', reviewRoutes);

// --- Track server to close it later ---
let server;

beforeAll((done) => {
  server = app.listen(0, done); // Use port 0 to auto-assign an available port
});

afterAll((done) => {
  if (server && server.close) {
    server.close(done);
  } else {
    done();
  }
});

// ---------- POST /reviews ----------
describe('POST /reviews', () => {
  it('should create a review and return it with 201', async () => {
    const mockReviewData = {
      audiobookId: 'abc123',
      userId: 'user456',
      rating: 4,
      comment: 'Great audiobook!',
    };

    const mockSavedReview = {
      _id: 'review789',
      ...mockReviewData,
    };

    // Mock constructor to return object with save()
    Review.mockImplementation(() => ({
      ...mockReviewData,
      save: jest.fn().mockResolvedValue(mockSavedReview),
    }));

    const response = await request(server).post('/reviews').send(mockReviewData);

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Review added');
    expect(response.body.review).toMatchObject(mockReviewData);
  });

  it('should handle errors during review creation', async () => {
    const mockReviewData = {
      audiobookId: 'abc123',
      userId: 'user456',
      rating: 4,
      comment: 'Nice!',
    };

    Review.mockImplementation(() => ({
      ...mockReviewData,
      save: jest.fn().mockRejectedValue(new Error('DB save failed')),
    }));

    const response = await request(server).post('/reviews').send(mockReviewData);

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('error', 'Failed to add review');
  });
});

// ---------- GET /reviews/:audiobookId ----------
describe('GET /reviews/:audiobookId', () => {
  it('should return a list of reviews for a given audiobook', async () => {
    const mockReviews = [
      { audiobookId: 'abc123', userId: 'user1', rating: 4, comment: 'Good' },
      { audiobookId: 'abc123', userId: 'user2', rating: 5, comment: 'Great' },
    ];

    // Mock the find method to return the mockReviews
    Review.find = jest.fn().mockResolvedValue(mockReviews);

    const response = await request(server).get('/reviews/abc123');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockReviews);
    expect(Review.find).toHaveBeenCalledWith({ audiobookId: 'abc123' });
  });

  it('should return 500 if there is a problem fetching reviews', async () => {
    // Mock the find method to reject with an error
    Review.find = jest.fn().mockRejectedValue(new Error('Database error'));

    const response = await request(server).get('/reviews/abc123');

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('error', 'Failed to fetch reviews');
  });
});

// ---------- GET /reviews/:audiobookId/summary ----------
describe('GET /reviews/:audiobookId/summary', () => {
  it('should return average rating and total reviews', async () => {
    const mockReviews = [
      { rating: 5 },
      { rating: 3 },
      { rating: 4 },
    ];

    // Mock the find method to return the mockReviews
    Review.find = jest.fn().mockResolvedValue(mockReviews);

    const response = await request(server).get('/reviews/abc123/summary');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      audiobookId: 'abc123',
      averageRating: 4.00,
      totalReviews: 3,
    });
  });

  it('should return 500 if there is an error during summary fetch', async () => {
    // Mock the find method to reject with an error
    Review.find = jest.fn().mockRejectedValue(new Error('Summary fetch error'));

    const response = await request(server).get('/reviews/abc123/summary');

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: 'Failed to get review summary' });
  });
});
