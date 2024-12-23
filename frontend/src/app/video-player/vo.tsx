import { useEffect, useRef } from 'react';
import cloudinary from 'cloudinary-video-player';

interface VideoPlayerProps {
  id: string; // ID is now required for the video element
  publicId: string;
  playerConfig?: Record<string, unknown>;
  sourceConfig?: Record<string, unknown>;
  [key: string]: unknown; // For any additional props
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ 
  id, 
  publicId, 
  playerConfig = {}, 
  sourceConfig = {}, 
  ...props 
}) => {
  const cloudinaryRef = useRef<typeof cloudinary | null>(null);

  useEffect(() => {
    if (cloudinaryRef.current) return;

    cloudinaryRef.current = cloudinary;

    const player = cloudinaryRef.current.videoPlayer(id, { // Pass the `id` as a string
      cloud_name: 'dcdlxeu52',
      secure: true,
      controls: true,
      ...playerConfig,
    });
    player.source(publicId, sourceConfig);
  }, [id, publicId, playerConfig, sourceConfig]);

  return (
    <video
      id={id}
      className="cld-video-player cld-fluid"
      {...props}
    />
  );
};

export default VideoPlayer;
