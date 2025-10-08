import React, { useState } from "react";
import { Image, Plus, Pencil, Trash2, X } from "lucide-react";
import {
  useGetCarouselImagesQuery,
  useAddCarouselImageMutation,
  useUpdateCarouselImageMutation,
  useDeleteCarouselImageMutation,
} from "../../redux/api/carouselApi";

export default function CarouselPage() {
  const { data, isLoading } = useGetCarouselImagesQuery();
  const carousels = data?.data || [];

  const [addCarouselImage] = useAddCarouselImageMutation();
  const [updateCarouselImage] = useUpdateCarouselImageMutation();
  const [deleteCarouselImage] = useDeleteCarouselImageMutation();

  const [newImage, setNewImage] = useState("");
  const [hoveredId, setHoveredId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-4 text-slate-600 font-medium">
            Loading carousel images...
          </p>
        </div>
      </div>
    );
  }

  const handleAdd = async () => {
    if (!newImage.trim()) return;
    await addCarouselImage({ image: newImage, path: "/carousel" });
    setNewImage("");
  };

  const handleUpdate = async (id) => {
    const updatedUrl = prompt("Enter new image URL:");
    if (!updatedUrl) return;
    await updateCarouselImage({ id, image: updatedUrl, path: "/carousel" });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this image?")) {
      setDeletingId(id);
      await deleteCarouselImage(id);
      setTimeout(() => setDeletingId(null), 300);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-600 rounded-lg shadow-lg">
              <Image className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Carousel Manager
            </h1>
          </div>
          <p className="text-slate-600 ml-14">
            Manage your homepage carousel images with ease
          </p>
        </div>

        {/* Add Image Section */}
        <div className="mb-8 animate-slide-up">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 hover:shadow-2xl transition-shadow duration-300">
            <label className="block text-sm font-semibold text-slate-700 mb-3">
              Add New Carousel Image
            </label>
            <div className="flex gap-3">
              <div className="flex-1 relative group">
                <input
                  className="w-full border-2 border-slate-200 rounded-xl p-3 pl-4 pr-10 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all duration-300"
                  placeholder="Enter image URL..."
                  value={newImage}
                  onChange={(e) => setNewImage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                />
                {newImage && (
                  <button
                    onClick={() => setNewImage("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
              <button
                onClick={handleAdd}
                disabled={!newImage}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-slate-300 disabled:to-slate-400 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 transition-all duration-200 flex items-center gap-2 disabled:cursor-not-allowed disabled:transform-none"
              >
                <Plus className="w-5 h-5" />
                Add Image
              </button>
            </div>
          </div>
        </div>

        {/* Images Grid */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-700 mb-4">
            Current Images ({carousels.length})
          </h2>

          {carousels.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-12 text-center">
              <div className="inline-block p-4 bg-slate-100 rounded-full mb-4">
                <Image className="w-12 h-12 text-slate-400" />
              </div>
              <p className="text-slate-500 text-lg">No carousel images yet</p>
              <p className="text-slate-400 text-sm mt-2">
                Add your first image to get started
              </p>
            </div>
          ) : (
            <ul className="space-y-3">
              {carousels.map((c, index) => (
                <li
                  key={c._id}
                  onMouseEnter={() => setHoveredId(c._id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className={`group bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-2xl transition-all duration-300 ${
                    deletingId === c._id
                      ? "animate-slide-out"
                      : "animate-slide-in"
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center gap-4 p-4">
                    {/* Image Preview */}
                    <div className="relative flex-shrink-0 overflow-hidden rounded-xl shadow-md group-hover:shadow-xl transition-shadow duration-300">
                      <img
                        src={c.image}
                        alt=""
                        className="h-24 w-40 object-cover transform group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>

                    {/* URL Display */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-700 truncate">
                        {c.image}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">ID: {c._id}</p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
                      <button
                        onClick={() => handleUpdate(c._id)}
                        className="bg-amber-500 hover:bg-amber-600 text-white p-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-110 active:scale-95 transition-all duration-200"
                        title="Update image"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(c._id)}
                        className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-110 active:scale-95 transition-all duration-200"
                        title="Delete image"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Animations */}
      <style >{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes slide-out {
          to {
            opacity: 0;
            transform: translateX(20px);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
        .animate-slide-up {
          animation: slide-up 0.6s ease-out;
        }
        .animate-slide-in {
          animation: slide-in 0.4s ease-out backwards;
        }
        .animate-slide-out {
          animation: slide-out 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
