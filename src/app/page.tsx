"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import "./globals.css";
import UploadAudio from "@/components/UploadAudio";
import MusicList from "@/components/MusicList";
import MusicPlayer from "@/components/MusicPlayer";

export default function Home() {
  const [audioFiles, setAudioFiles] = useState<
    { id: number; name: string; url: string; AudioData: any }[]
  >([]);
  const [currentSong, setCurrentSong] = useState<number | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Function to handle file upload and add it to the list of audio files
  const handleUpload = (file: File, name: string, audioData: any) => {
    const url = URL.createObjectURL(file);
    setAudioFiles((prevFiles) => [
      ...prevFiles,
      { id: prevFiles.length, name, url, AudioData: audioData },
    ]);
  };

  const handleSongChange = (index: number) => {
    setCurrentSong(index);
  };

  // Function to play or pause the audio
  const handlePlayPause = () => {
    if (audioRef.current?.paused) {
      audioRef.current.play();
      setIsPlaying(true);
    } else {
      audioRef.current?.pause();
      setIsPlaying(false);
    }
  };

  // Function to handle play action for a specific song
  const handlePlay = (id: number) => {
    setCurrentIndex(id);
    setCurrentSong(id);
    if (currentSong === id) {
      console.log("current song is equal or not", currentSong, id);
      handlePlayPause();
    }
  };

  const handleRename = (id: number, newName: string) => {
    setAudioFiles((prevFiles) =>
      prevFiles.map((file) =>
        file.id === id ? { ...file, name: newName } : file
      )
    );
  };

  // Effect to set the current song when a new file is uploaded
  useEffect(() => {
    // document.body.classList.add('dark'); // Set dark mode by default
    if (audioFiles.length && audioFiles.length < 2) {
      setCurrentSong(1);
    }
  }, [audioFiles]);

  // Effect to play the current song when it's set
  useEffect(() => {
    if (currentSong == 0 || currentSong) {
      if (audioRef.current) {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  }, [currentSong, setCurrentSong, currentIndex]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="space-y-2">
        <UploadAudio
          onUpload={handleUpload}
          onRename={handleRename}
          files={audioFiles}
        />
        <MusicList
          files={audioFiles}
          currentId={currentSong || 0}
          onPlay={handlePlay}
        />
        {currentSong !== null && (
          <MusicPlayer
            files={audioFiles}
            currentIndex={currentIndex}
            setCurrentIndex={setCurrentIndex}
            audioRef={audioRef}
            handlePlayPause={handlePlayPause}
            isPlaying={isPlaying}
          />
        )}
      </div>
    </main>
  );
}
