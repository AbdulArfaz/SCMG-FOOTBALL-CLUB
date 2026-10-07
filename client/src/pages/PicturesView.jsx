import React, { useState, useEffect } from "react";
import { Image as ImageIcon, Video as VideoIcon, Calendar } from "lucide-react";
import { fetchPictures, fetchVideos } from "../services/api.js";


export default function PicturesView() {
  const [activeTab, setActiveTab] = useState("pictures");
  const [items, setItems] = useState([]);


  useEffect(() => {
    loadMedia();
  }, [activeTab]);

  const loadMedia = async () => {
    try {
      if (activeTab === "pictures") {
        const res = await fetchPictures();
        setItems(res.data || []);
      } else {
        const res = await fetchVideos();
        setItems(res.data || []);
      }
    } catch (err) {
      console.error(`Error fetching ${activeTab}:`, err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-16 px-6 pt-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Banner & Switcher */}
        <div className="bg-linear-to-r from-slate-900 via-emerald-950 to-slate-900 border border-emerald-800/40 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-black text-emerald-400 flex items-center space-x-2">
              <ImageIcon className="h-6 w-6" />
              <span>Club Gallery & Highlights</span>
            </h1>
            <p className="text-sm text-slate-300 mt-1">Explore official team pictures and matchday video reels.</p>
          </div>

          <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab("pictures")}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-bold transition ${
                activeTab === "pictures" ? "bg-emerald-500 text-slate-950 shadow" : "text-slate-300 hover:text-white"
              }`}
            >
              <ImageIcon className="h-4 w-4" />
              <span>Pictures</span>
            </button>
            <button
              onClick={() => setActiveTab("videos")}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-bold transition ${
                activeTab === "videos" ? "bg-emerald-500 text-slate-950 shadow" : "text-slate-300 hover:text-white"
              }`}
            >
              <VideoIcon className="h-4 w-4" />
              <span>Videos</span>
            </button>
          </div>
        </div>

        {/* Media Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {items.map((item) => (
            <div key={item._id} className="border border-slate-700/70 rounded-2xl overflow-hidden bg-slate-900/60 shadow-xl group">
              <div className="h-48 overflow-hidden relative bg-slate-950 flex items-center justify-center">
                {activeTab === "pictures" ? (
                  item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.title || "Gallery Image"}
                      className="w-full h-full object-contain group-hover:scale-105 transition duration-300"
                    />
                  ) : null
                ) : item.videoUrl && item.videoUrl.startsWith("/uploads/") ? (
                  <video
                    src={item.videoUrl}
                    controls
                    className="w-full h-full object-contain"
                  />
                ) : item.videoUrl ? (
                  <iframe 
                    src={item.videoUrl} 
                    title={item.title || "Video"} 
                    className="w-full h-full" 
                    allowFullScreen 
                  />
                ) : null}
              </div>
              <div className="p-4 flex justify-between items-center bg-slate-900 border-t border-slate-800">
                <h3 className="font-bold text-white text-sm truncate">{item.title}</h3>
                <span className="text-[10px] text-slate-400 flex items-center shrink-0">
                  <Calendar className="h-3 w-3 mr-1 text-emerald-400" />
                  {item.date ? new Date(item.date).toLocaleDateString() : ""}
                </span>
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <div className="col-span-full text-center py-16 text-slate-400 italic">
              No {activeTab} available at the moment. Check back soon!
            </div>
          )}
        </div>

      </div>
    </div>
  );
}