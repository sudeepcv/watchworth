import React, { useState, useEffect } from "react";
import { LoaderCircle, Plus } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";
import { API_URL, NOEMBED_URL } from "../config"; 
// const API_URL = window.__CONFIG__.VITE_API_URL;
// const NOEMBED_URL = window.__CONFIG__.VITE_NOEMBED_URL;



// Fetch video details from the Noembed API
const fetchVideoDetails = async (url, setLoadingVideo, setVideoDetails, setError) => {
  try {
    setLoadingVideo(true);
    const response = await fetch(`${NOEMBED_URL}${url}`);
    const data = await response.json();

    if (data.error) {
      setError("Invalid URL or an error occurred while fetching the video.");
      setVideoDetails(null);
    } else {
      setVideoDetails(data);
      setError("");
    }
  } catch (err) {
    setError("Failed to fetch video details.");
    setVideoDetails(null);
  } finally {
    setLoadingVideo(false);
  }
};

// Form component for video URL input and Add button
const VideoForm = ({ url, setUrl, videoDetails, handleAddVideo, error, isLoadingVideo, isLoadingButton }) => (
  <div className="justify-self-center bg-gray-100 w-1/2 mx-auto my-10 p-4 shadow-md rounded-lg">
    <div className="flex w-full">
      <input
        type="text"
        id="input-with-button"
        name="input-with-button"
        className={`mr-2 py-2 px-4 w-full border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-l-lg ${
          error
            ? "ring-1 border-red-500 ring-red-500 focus:border-red-500 focus:ring-red-500"
            : ""
        }`}
        placeholder="Type YouTube URL..."
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <button
        type="button"
        className="flex items-center px-4 py-2 bg-blue-500 text-white font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 rounded-r-lg disabled:bg-slate-50 disabled:text-black"
        onClick={handleAddVideo}
        disabled={!videoDetails || isLoadingVideo || error || isLoadingButton}
      >
        {isLoadingButton || isLoadingVideo ? (
          <>
            <LoaderCircle className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" />
            Adding...
          </>
        ) : (
          <>
            <Plus className="w-5 h-5 mr-1" />
            Add
          </>
        )}
      </button>
    </div>
    {error && <p className="text-red-500 mt-2">{error}</p>}
    {videoDetails && (
      <div className="mt-4">
        <img
          src={videoDetails.thumbnail_url}
          alt={videoDetails.title}
          className="w-full max-w-sm mx-auto"
        />
        <p className="mt-2 text-center">{videoDetails.title}</p>
      </div>
    )}
  </div>
);

// Component to display the table of videos
const VideoTable = ({ videos }) => (
  <div className="w-1/2 justify-self-center">
    {videos.length === 0 ? (
      <div
        className="flex items-center bg-blue-500 text-white text-sm font-bold px-4 py-3"
        role="alert"
      >
        <p>There are currently no videos in the list. Add some videos to see them here.</p>
      </div>
    ) : (
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-separate border-spacing-y-3">
          <thead className="bg-gray-50 border-b-2 border-gray-200">
            <tr>
              <th className="p-3 text-sm font-semibold tracking-wide text-left">Video</th>
              <th className="p-3 text-sm font-semibold tracking-wide text-left">Title</th>
              <th className="p-3 text-sm font-semibold tracking-wide text-left">Author</th>
            </tr>
          </thead>
          <tbody>
            {videos.map((video, index) => (
              <tr key={index} className="hover:bg-slate-100 odd:bg-white even:bg-slate-50">
                <td>
                  <img
                    className="h-12 w-12 flex-none rounded-full bg-gray-50"
                    src={video.thumbnailUrl}
                    alt={video.title}
                  />
                </td>
                <td className="text-left">
                  <a
                    href={video.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    <p className="truncate w-96" title={video.title}>
                      {video.title}
                    </p>
                  </a>
                </td>
                <td className="text-left">
                  <a
                    href={video.authorUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {video.authorName}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
);

function App() {
  const [url, setUrl] = useState("");
  const [videoDetails, setVideoDetails] = useState(null);
  const [error, setError] = useState("");
  const [isLoadingVideo, setLoadingVideo] = useState(false);
  const [isLoadingButton, setLoadingButton] = useState(false);
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch(`${API_URL}/api/videos`);
        if (response.ok) {
          const data = await response.json();
          setVideos(data);
        } else {
          console.error("Failed to fetch videos");
        }
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };
    fetchVideos();
  }, []);


  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (url) {
        fetchVideoDetails(url, setLoadingVideo, setVideoDetails, setError);
      } else {
        resetForm();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [url]);

  const handleAddVideo = () => {
    const addVideoPromise = new Promise((resolve, reject) => {
      setLoadingButton(true);
      setTimeout(async () => {
        if (videoDetails) {
          try {
            const response = await fetch(`${API_URL}/api/videos`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                title: videoDetails.title,
                authorName: videoDetails.author_name,
                authorUrl: videoDetails.author_url,
                thumbnailUrl: videoDetails.thumbnail_url,
                videoUrl: videoDetails.url,
              }),
            });
  
            if (response.ok) {
              resolve("Video added successfully!");
              const newVideo = await response.json();
              setVideos([newVideo, ...videos]); 
            } else {
              reject("Failed to add video.");
            }
          } catch (error) {
            reject("Failed to add video.");
          }
        } else {
          reject("No video details found.");
        }
      }, 1000);
    });
  
    toast.promise(addVideoPromise, {
      loading: "Adding video...",
      success: <b>Video added successfully!</b>,
      error: <b>Failed to add video.</b>,
    }).finally(() => {
      setLoadingButton(false);
    });
  
    resetForm();
  };

  const resetForm = () => {
    setVideoDetails(null);
    setUrl("");
    setError("");
  };

  return (
    <div className="p-3 grid w-full">
      <VideoForm
        url={url}
        setUrl={setUrl}
        videoDetails={videoDetails}
        handleAddVideo={handleAddVideo}
        error={error}
        isLoadingVideo={isLoadingVideo}
        isLoadingButton={isLoadingButton}
      />


      <VideoTable videos={videos} />
      <Toaster />
    </div>
  );
}

export default App;




