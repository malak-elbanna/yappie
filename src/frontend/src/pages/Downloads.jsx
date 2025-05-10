import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  deleteChapter,
  getAllDownloadedChapters 
} from '../utils/download';

const DownloadsPage = () => {
  const [downloadedChapters, setDownloadedChapters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeChapter, setActiveChapter] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRefs = useRef({});

  useEffect(() => {
    const fetchDownloads = async () => {
      try {
        const chapters = await getAllDownloadedChapters();
        setDownloadedChapters(chapters);
      } catch (error) {
        console.error('Error fetching downloads:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDownloads();
  }, []);

  const handleDeleteChapter = async (key) => {
    try {
      await deleteChapter(key);
      setDownloadedChapters(prev => prev.filter(ch => ch.key !== key));
    } catch (error) {
      console.error('Error deleting chapter:', error);
    }
  };

  const handlePlay = async (index, blob) => {
    if (activeChapter !== null && audioRefs.current[activeChapter]) {
      audioRefs.current[activeChapter].pause();
    }
    
    setActiveChapter(index);
    setIsPlaying(true);

    if (!audioRefs.current[index]) {
      return;
    }

    const audioUrl = URL.createObjectURL(blob);
    audioRefs.current[index].src = audioUrl;
    
    try {
      await audioRefs.current[index].play();
    } catch (err) {
      console.error('Error playing audio:', err);
      setIsPlaying(false);
    }
  };

  const handlePause = (index) => {
    if (audioRefs.current[index]) {
      audioRefs.current[index].pause();
      setIsPlaying(false);
    }
  };

  if (isLoading) {
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

        <h1 className="text-3xl font-bold mb-8 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-2 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          My Downloads
        </h1>

        {downloadedChapters.length === 0 ? (
          <div className="bg-gray-800 bg-opacity-40 backdrop-blur-md rounded-2xl shadow-lg p-8 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-xl font-medium mb-2">No Downloads Yet</h3>
            <p className="text-gray-400 mb-6">Download chapters from audiobooks to listen offline</p>
            <Link 
              to="/books" 
              className="inline-flex items-center bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-medium px-6 py-2 rounded-xl shadow-lg hover:shadow-pink-600/30 transition duration-300"
            >
              Browse Audiobooks
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {downloadedChapters.map(({ key, bookId, chapterIndex, blob }, index) => {
              const isActive = activeChapter === index;
              const chapterTitle = `Chapter ${chapterIndex + 1}`;
              
              return (
                <div key={key} className={`bg-gray-800 bg-opacity-40 backdrop-blur-md rounded-2xl shadow-lg p-6 transition ${
                  isActive ? 'border-l-4 border-purple-500' : ''
                }`}>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-lg truncate">{chapterTitle}</h3>
                    </div>
                    <span className="bg-green-900 bg-opacity-30 text-green-400 text-xs px-2 py-1 rounded-full">
                      Downloaded
                    </span>
                  </div>

                  <div className="mt-4 flex items-center space-x-4">
                    <button
                      onClick={() => {
                        if (isActive && isPlaying) {
                          handlePause(index);
                        } else {
                          handlePlay(index, blob);
                        }
                      }}
                      className={`p-3 rounded-full ${
                        isActive && isPlaying ? 'bg-red-600 hover:bg-red-700' : 'bg-purple-600 hover:bg-purple-500'
                      } transition`}
                    >
                      {isActive && isPlaying ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        </svg>
                      )}
                    </button>

                    <div className="flex-1 bg-gray-700 bg-opacity-50 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-full transition-all duration-300"
                        style={{ width: isActive ? `${(audioRefs.current[index]?.currentTime / audioRefs.current[index]?.duration) * 100 || 0}%` : '0%' }}
                      ></div>
                    </div>

                    <div className="text-xs text-gray-400 w-16 text-right">
                      {isActive && audioRefs.current[index] ? (
                        <>
                          {Math.floor(audioRefs.current[index].currentTime / 60)}:
                          {Math.floor(audioRefs.current[index].currentTime % 60).toString().padStart(2, '0')}
                        </>
                      ) : (
                        '0:00'
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-6">
                    <Link 
                      to={`/books/${bookId}`}
                      className="text-purple-400 hover:text-purple-300 text-sm font-medium transition"
                    >
                      Go to Book
                    </Link>
                    
                    <button
                      onClick={() => handleDeleteChapter(key)}
                      className="text-red-400 hover:text-red-300 p-2 rounded-full hover:bg-red-900 hover:bg-opacity-30 transition"
                      title="Delete Download"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>

                  <audio
                    ref={el => audioRefs.current[index] = el}
                    onEnded={() => setIsPlaying(false)}
                    onTimeUpdate={() => {
                      setDownloadedChapters(prev => [...prev]);
                    }}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default DownloadsPage;
