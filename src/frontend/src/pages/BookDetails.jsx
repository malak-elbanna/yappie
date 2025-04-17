import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import API from '../Stream';

const BookDetails = () => {
  const { id } = useParams();
  const { userId } = useAuth(); 

  const [book, setBook] = useState(null);
  const [positions, setPositions] = useState({});
  const [currentAudio, setCurrentAudio] = useState(null);

  useEffect(() => {
    API.get(`/books/${id}`)
      .then(res => setBook(res.data))
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

  return (
    <div className="p-4">
      {book ? (
        <>
          <h2 className="text-3xl font-bold">{book.title}</h2>
          <p className="text-gray-600">{book.author}</p>
          <p>{book.description}</p>

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
