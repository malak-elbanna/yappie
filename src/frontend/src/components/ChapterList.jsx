import React from 'react';

const ChaptersList = ({
    book,
    isOffline,
    activeChapter,
    isPlaying,
    positions,
    audioRefs,
    handlePlay,
    handlePause,
    handleDownloadChapter,
    handleSeek,
    handleSavePosition,
    handleAutoPlayNext,
    setPositions,
    setIsPlaying
}) => {
  return (
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
  );
};

export default ChaptersList;
