"use client";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import DefaultImg from "../../public/music.png";

interface AudioFile {
  id: number;
  name: string;
  AudioData: {
    id: number;
    name: string;
    url: string;
    album?: string;
    artist?: string;
    duration?: number;
    year?: number;
    image?: string;
  };
}

interface MusicListProps {
  files: AudioFile[];
  currentId: number;
  onPlay: (id: number) => void;
}

const formatDuration = (seconds?: number) => {
  if (!seconds) return "N/A";
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${secs}`;
};

const removeExtension = (audioName?: string) => {
  let audio = audioName?.split(".");
  return audio?.[0];
};
const getFirst10Chars = (input: string): string => {
  return input.substring(0, 20);
};

const MusicList: React.FC<MusicListProps> = ({ files, currentId, onPlay }) => {
  const [view, setView] = useState<"table" | "grid">("table");

  return (
    <div>
      <button
        onClick={() => setView(view === "table" ? "grid" : "table")}
        className="mb-4 bg-gray-200 px-3 py-1 rounded"
      >
        Toggle View
      </button>

      {view === "table" ? (
        <table className="table-auto w-full text-leftw-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="py-3">
                #
              </th>
              <th scope="col" className="py-3">
                Image
              </th>
              <th scope="col" className="py-3"></th>
              <th scope="col" className="py-3">
                Duration
              </th>
            </tr>
          </thead>
          <tbody>
            {files.map((file) => (
              <tr
                key={file.id}
                onClick={() => onPlay(file.id)}
                className={`bg-white border-b dark:bg-gray-800 dark:border-gray-700 ${
                  file.id === currentId ? "bg-green-100" : ""
                }`}
              >
                <td className="pr-6 py-4">{file.id + 1}.</td>
                <td className="py-4">
                  {file.AudioData.image ? (
                    <Image
                      src={file.AudioData.image}
                      alt={file.name}
                      width={100}
                      height={100}
                      className="w-16 h-16"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-300 flex items-center justify-center">
                      <Image
                        src={DefaultImg}
                        alt={`${file.AudioData.name}`}
                        className="w-16 h-16"
                        width={100}
                        height={100}
                      />
                    </div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div>{removeExtension(file?.AudioData?.name)}</div>
                  <div>{file.AudioData.artist || "Unknown"}</div>
                </td>
                <td className="px-6 py-4">
                  {formatDuration(file.AudioData.duration)}
                </td>
                <td></td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="flex flex-wrap gap-4">
          {files.map((file) => (
            <Card
              key={file.id}
              onClick={() => onPlay(file.id)}
              className={`bg-gray-100 p-4 rounded ${
                file.id === currentId ? "bg-green-100" : ""
              } w-40 h-60 flex flex-col justify-between cursor-pointer px-0 py-0`}
            >
              <aside>
                {file.AudioData.image ? (
                  <Image
                    src={file.AudioData.image}
                    alt={file.name}
                    width={160}
                    height={160}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                    <Image
                      src={DefaultImg}
                      alt={`${file.AudioData.name}`}
                      className="w-full h-full object-cover"
                      width={160}
                      height={160}
                    />
                  </div>
                )}
              </aside>
              <aside className="p-2">
                <div className="font-medium text-lg">
                  {getFirst10Chars(file?.AudioData?.name)}
                </div>
                <div className="text-sm">{file.AudioData.year || "N/A"}</div>
              </aside>
            </Card>
          ))}
        </div>
      )}

      {!files.length && <h2>Please Add Audio Items To Use Music Player</h2>}
    </div>
  );
};

export default MusicList;
