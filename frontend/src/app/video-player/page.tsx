
"use client";
import React from 'react'
import { useState } from 'react';
const params = { cloudName: "dcdlxeu52", publicId: "mk5baauljkpshyqunwov" };
import VideoPlayer from './vo';
import 'cloudinary-video-player/cld-video-player.min.css';
import VideoScreen from '@/components/video-screen';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  PlayCircle, 
  PauseCircle, 
  FastForward, 
  Rewind, 
  MessageCircle, 
  Edit3, 
  Flag, 
  ThumbsUp, 
  ThumbsDown, 
  Clock, 
  ChevronDown, 
  ChevronUp,
  Volume2,
  VolumeX,
  Settings,
  Maximize
} from 'lucide-react'
interface Note {
  id: string
  content: string
  timestamp: number
}

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
function App() {
  const [notes, setNotes] = useState<Note[]>([])
  const [noteInput, setNoteInput] = useState('')
  const [currentTime, setCurrentTime] = useState(0)
  const [activeTab, setActiveTab] = useState('comments')


  const addNote = (withTimestamp: boolean = false) => {
    if (noteInput.trim()) {
      const newNote: Note = {
        id: Date.now().toString(),
        content: noteInput,
        timestamp: withTimestamp ? currentTime : -1,
      }
      setNotes([...notes, newNote])
      setNoteInput('')
    }
  }
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }


  return (
    <div>
      <h2>Video-player</h2>
      <VideoPlayer
        id="player2"
        publicId="courses/course_1731860592247/promo/pdaghb8har5govvqpxpa"
        playerConfig={{
          muted: true,
          posterOptions: {
            transformation: { effect: 'blur' },
          },
          playbackRates: [0.25,0.5, 1, 1.5, 2], // Playback speed options
        }}
        sourceConfig={{
          sourceTypes: ['hls'], // Specify HLS as the only source type
        }}
      />
      {/* <VideoScreen/> */}

              <div className="flex gap-2">
                <Textarea
                  placeholder="Add a note..."
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                />
                <div className="flex flex-col gap-2">
                  <Button onClick={() => addNote(false)}>
                    <Edit3 className="h-4 w-4 mr-2" />
                    Add Note
                  </Button>
                  <Button onClick={() => addNote(true)}>
                    <Clock className="h-4 w-4 mr-2" />
                    Add with Timestamp
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                {notes.map((note) => (
                  <div key={note.id} className="bg-muted p-2 rounded-md">
                    {note.timestamp !== -1 && (
                      <p className="text-sm text-muted-foreground">
                        {formatTime(note.timestamp)}
                      </p>
                    )}
                    <p>{note.content}</p>
                  </div>
                ))}
              </div>
            
    </div>
  );
}

export default App;
