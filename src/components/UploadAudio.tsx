"use client";
import { useState } from "react";
import * as mm from "music-metadata";
import { Card } from "./ui/card";

interface AudioFile {
  id: number;
  name: string;
  url: string;
  title?: string;
  image?: string;
  album?: string;
  artist?: string;
  duration?: number;
  year?: number;
}

interface UploadAudioProps {
  onUpload: (file: File, name: string, audioData: any) => void;
  onRename: (id: number, newName: string) => void;
  files: AudioFile[];
}

// Props interface for the UploadAudio component
const UploadAudio: React.FC<UploadAudioProps> = ({
  onUpload,
  onRename,
  files,
}) => {
  const [audioName, setAudioName] = useState("");
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [editId, setEditId] = useState<number | null>(null);
  const [newName, setNewName] = useState("");
  const [audioProps, setAudioProps] = useState<any>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setAudioFile(file);
      setAudioName(file.name);

      // Extract metadata from the file
      const metadata = await mm.parseBlob(file);
      const { album, artist, year, title, picture } = metadata.common;
      const { duration } = metadata.format;

      let image = "";
      if (picture && picture.length > 0) {
        const pictureData = picture[0].data;
        const base64String = btoa(
          new Uint8Array(pictureData).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            ""
          )
        );
        image = `data:${picture[0].format};base64,${base64String}`;
      }

      const audioData: AudioFile = {
        id: Date.now(),
        name: audioName || file.name,
        url: URL.createObjectURL(file),
        album,
        // picture,
        image,
        title,
        artist,
        duration,
        year,
      };

      setAudioProps(audioData);
    }
  };

  const handleUpload = () => {
    if (audioFile) {
      onUpload(audioFile, audioName, audioProps);
      setAudioFile(null);
      setAudioName("");
    }
  };

  return (
    <Card className="flex flex-col gap-4 p-3 w-full">
      <h2 className="text-start text-xl">Add New Music</h2>
      <div className="flex gap-2 items-center justify-between flex-wrap">
        <input type="file" accept="audio/*" onChange={handleFileChange} />
        <div>
          <label className="block text-sm font-medium text-gray-900">
            Edit Audio Name
          </label>
          <input
            type="text"
            value={audioName}
            onChange={(e) => setAudioName(e.target.value)}
            placeholder="Edit Audio Name"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm font-semibold rounded-lg focus:ring-blue-500 focus:border-blue-500 px-3 py-2"
          />
        </div>
        <button
          onClick={handleUpload}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Upload Audio
        </button>
      </div>
    </Card>
  );
};

export default UploadAudio;
