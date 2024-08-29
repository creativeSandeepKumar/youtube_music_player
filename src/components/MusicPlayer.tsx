"use client";
import { useEffect, useRef, useState } from 'react';
import {  CiPause1 as PauseIcon } from "react-icons/ci";
import { AiOutlinePlayCircle as PlayIcon } from "react-icons/ai";
import { GrCaretPrevious as PreviousIcon, GrCaretNext as NextIcon } from "react-icons/gr";

interface AudioFile {
  id: number;
  name: string;
  url: string;
}

interface MusicPlayerProps {
  files: AudioFile[];
  currentIndex: number;
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
  audioRef: React.RefObject<HTMLAudioElement>;
  handlePlayPause: () => void;
  isPlaying: boolean;
}

const getFirst10Chars = (input: string): string => {
  return input.substring(0, 10);
};

const MusicPlayer: React.FC<MusicPlayerProps> = ({ files, currentIndex, setCurrentIndex, audioRef, handlePlayPause, isPlaying }) => {


  useEffect(() => {
    const handleEnded = () => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % files.length);
    };

    if (audioRef.current) {
      audioRef.current.addEventListener('ended', handleEnded);
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('ended', handleEnded);
      }
    };
  }, [files.length]);

  


  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % files.length);
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + files.length) % files.length);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white p-4 flex items-center justify-between">
        <section className='flex flex-wrap gap-2 justify-between w-full'>
      <div className="flex items-center gap-4">
        <span>🎵</span>
        <span>{getFirst10Chars(files[currentIndex].name)}...</span>
      </div>
      <div className="flex items-center gap-4">
        <button onClick={handlePrevious} className='text-2xl'><PreviousIcon/></button>
        <button onClick={handlePlayPause} className='text-2xl'>
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </button>
        <button onClick={handleNext} className='text-2xl'><NextIcon/></button>
      </div>
      <div>
        <audio ref={audioRef} src={files[currentIndex].url} controls />
      </div>
      </section>
    </div>
  );
};

export default MusicPlayer;
