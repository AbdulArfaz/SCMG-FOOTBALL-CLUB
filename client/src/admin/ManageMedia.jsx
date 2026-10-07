import React, { useState, useEffect } from "react";
import { Image as ImageIcon, Video as VideoIcon, PlusCircle, Calendar } from "lucide-react";
import { fetchPictures, addPicture, fetchVideos, addVideo } from "../services/api";


export default function ManageMedia() {
  const [activeTab, setActiveTab] = useState("pictures");
  const [items, setItems] = useState([]);
  const [title, setTitle] = useState("");
  

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

  const handleAddMedia = async (e) => {
    e.preventDefault();

    try {
      const fileInput = document.getElementById("mediaFileInput");
      if (!fileInput || !fileInput.files[0]) return;

      const formData = new FormData();
      formData.append("title", title || "");
      
      if (activeTab === "pictures") {
        formData.append("image", fileInput.files[0]);
        await addPicture(formData);
      } else {
        formData.append("video", fileInput.files[0]);
        await addVideo(formData);
      }

      setTitle("");
      fileInput.value = "";
      loadMedia();
    } catch (err) {
      console.error("Error saving media:", err);
    }
  };

  return (
    <div className="space-y-8 text-white">
      {/* Header & Tab Switcher */}
      <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-emerald-400">Manage Club Media</h2>
          <p className="text-sm text-slate-300">Upload pictures or video files directly from your local device gallery.</p>
        </div>
        <div className="flex bg-slate-950 border border-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab("pictures")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
              activeTab === "pictures" ? "bg-emerald-500 text-slate-950" : "text-slate-300 hover:text-white"
            }`}
          >
            <ImageIcon className="h-4 w-4" />
            <span>Pictures</span>
          </button>
          <button
            onClick={() => setActiveTab("videos")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
              activeTab === "videos" ? "bg-emerald-500 text-slate-950" : "text-slate-300 hover:text-white"
            }`}
          >
            <VideoIcon className="h-4 w-4" />
            <span>Videos</span>
          </button>
        </div>
      </div>

      {/* Upload Form */}
      <form onSubmit={handleAddMedia} className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl shadow-xl grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
        <div>
          <label className="block text-xs font-bold text-emerald-400 uppercase mb-1">
            {activeTab === "pictures" ? "Picture Title" : "Video Title"}
          </label>
          <input
            type="text"
            placeholder={activeTab === "pictures" ? "e.g., Matchday Squad ⚽" : "e.g., Highlights Reel 🎥"}
            value={title || ""}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-emerald-400 uppercase mb-1">
            {activeTab === "pictures" ? "Select Image File" : "Select Video File"}
          </label>
          <input
            id="mediaFileInput"
            type="file"
            accept={activeTab === "pictures" ? "image/*" : "video/*"}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-xs text-slate-300 file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-emerald-500 file:text-slate-950 hover:file:bg-emerald-600"
            required
          />
        </div>
        <div>
          <button
            type="submit"
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold py-2.5 rounded-xl transition flex items-center justify-center space-x-1 shadow-lg"
          >
            <PlusCircle className="h-4 w-4" />
            <span>Upload {activeTab === "pictures" ? "Picture" : "Video"}</span>
          </button>
        </div>
      </form>

      {/* Media Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {items.map((item) => (
          <div key={item._id} className="border border-slate-700/70 rounded-2xl overflow-hidden bg-slate-900/60 shadow-xl">
            <div className="h-48 overflow-hidden relative bg-slate-950 flex items-center justify-center">
              {activeTab === "pictures" ? (
                <img 
                  src={item.imageUrl} 
                  alt={item.title} 
                  className="w-full h-full object-contain" 
                />
              ) : (
                <video 
                  src={item.videoUrl}
                  controls 
                  className="w-full h-full object-contain" 
                />
              )}
            </div>
            <div className="p-4 flex justify-between items-center bg-slate-900 border-t border-slate-800">
              <h3 className="font-bold text-white text-sm truncate">{item.title}</h3>
              <span className="text-[10px] text-slate-400 flex items-center">
                <Calendar className="h-3 w-3 mr-1 text-emerald-400" />
                {new Date(item.date).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="col-span-full text-center py-12 text-slate-500 italic">
            No {activeTab} uploaded yet.
          </div>
        )}
      </div>
    </div>
  );
}