import React, { useState, useRef } from "react";
import { Image, Plus, Pencil, Trash2, X } from "lucide-react";
import {
  useGetCarouselImagesQuery,
  useAddCarouselImageMutation,
  useUpdateCarouselImageMutation,
  useDeleteCarouselImageMutation,
} from "../../redux/api/carouselApi";

export default function CarouselPage() {
  const { data, isLoading: isFetching } = useGetCarouselImagesQuery();
  const carousels = data?.data || [];

  const [addCarouselImage, { isLoading: isAdding }] = useAddCarouselImageMutation();
  const [updateCarouselImage, { isLoading: isUpdating }] = useUpdateCarouselImageMutation();
  const [deleteCarouselImage, { isLoading: isDeleting }] = useDeleteCarouselImageMutation();

  const [newFile, setNewFile] = useState(null);
  const [newImageUrlPreview, setNewImageUrlPreview] = useState("");
  const [newRedirectUrl, setNewRedirectUrl] = useState("");
  const [hoveredId, setHoveredId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const [updatingItem, setUpdatingItem] = useState(null);
  const updateFileRef = useRef();

  const onChooseFile = (e) => {
    const f = e.target.files?.[0] || null;
    setNewFile(f);
    if (f) setNewImageUrlPreview(URL.createObjectURL(f));
    else setNewImageUrlPreview("");
  };

  const resetAddForm = () => {
    setNewFile(null);
    setNewImageUrlPreview("");
    setNewRedirectUrl("");
    const el = document.getElementById("carousel-file-input");
    if (el) el.value = "";
  };

  const handleAdd = async () => {
    try {
      if (!newFile) return alert("Please choose an image file to upload.");

      const fd = new FormData();
      fd.append("image", newFile);
      if (newRedirectUrl?.trim()) fd.append("redirectUrl", newRedirectUrl.trim());

      await addCarouselImage(fd).unwrap();
      resetAddForm();
    } catch (err) {
      console.error("Add failed:", err);
      alert(err?.data?.message || err?.message || "Upload failed");
    }
  };

  const openUpdateDialog = (item) => {
    setUpdatingItem({ id: item._id, redirectUrl: item.redirectUrl || "" });
    if (updateFileRef.current) updateFileRef.current.value = "";
  };

  const handleUpdateSubmit = async () => {
    if (!updatingItem) return;
    try {
      const fd = new FormData();
      const fileInput = updateFileRef.current;
      const chosen = fileInput?.files?.[0];
      if (chosen) fd.append("image", chosen);
      fd.append("redirectUrl", updatingItem.redirectUrl || "");

      await updateCarouselImage({ id: updatingItem.id, data: fd }).unwrap();
      setUpdatingItem(null);
    } catch (err) {
      console.error("Update failed:", err);
      alert(err?.data?.message || err?.message || "Update failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this image?")) return;
    try {
      setDeletingId(id);
      await deleteCarouselImage(id).unwrap();
      setDeletingId(null);
    } catch (err) {
      console.error("Delete failed:", err);
      setDeletingId(null);
      alert(err?.data?.message || err?.message || "Delete failed");
    }
  };

  if (isFetching) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block rounded-full h-12 w-12 border-4 border-gray-300 border-t-transparent" />
          <p className="mt-4 text-gray-700 font-medium">Loading carousel images...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gray-700 rounded-lg">
              <Image className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-semibold text-gray-900">Carousel Manager</h1>
          </div>
          <p className="text-gray-600">Manage homepage carousel images</p>
        </div>

        {/* Add Image Section */}
        <div className="mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">Add New Carousel Image</label>

            <div className="flex gap-3 items-center">
              <div className="flex items-center gap-3 flex-1">
                <label className="flex items-center gap-3 w-full">
                  <input
                    id="carousel-file-input"
                    type="file"
                    accept="image/*"
                    onChange={onChooseFile}
                    className="hidden"
                  />
                  <div className="w-full">
                    <input
                      className="w-full border border-gray-200 rounded-md p-3 focus:outline-none"
                      placeholder="Choose an image file..."
                      value={newFile ? newFile.name : ""}
                      readOnly
                      onClick={() => document.getElementById("carousel-file-input")?.click()}
                    />
                    {newImageUrlPreview && (
                      <button
                        onClick={() => {
                          setNewFile(null);
                          setNewImageUrlPreview("");
                          const el = document.getElementById("carousel-file-input");
                          if (el) el.value = "";
                        }}
                        className="text-gray-600 text-sm mt-2"
                      >
                        Remove file
                      </button>
                    )}
                  </div>
                </label>
              </div>

              <input
                className="border border-gray-200 rounded-md p-3 w-80"
                placeholder="Redirect URL (optional)"
                value={newRedirectUrl}
                onChange={(e) => setNewRedirectUrl(e.target.value)}
              />

              <button
                onClick={handleAdd}
                disabled={!newFile || isAdding}
                className="bg-gray-800 text-white px-4 py-2 rounded-md"
              >
                {isAdding ? "Uploading..." : (
                  <span className="inline-flex items-center gap-2"><Plus className="w-4 h-4" /> Upload</span>
                )}
              </button>
            </div>

            {/* Preview */}
            {newImageUrlPreview && (
              <div className="mt-4">
                <p className="text-xs text-gray-500 mb-2">Preview</p>
                <div className="w-64 h-36 rounded-md overflow-hidden shadow-sm">
                  <img src={newImageUrlPreview} alt="preview" className="w-full h-full object-cover" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Images Grid */}
        <div>
          <h2 className="text-lg font-medium text-gray-800 mb-4">Current Images ({carousels.length})</h2>

          {carousels.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <div className="inline-block p-4 bg-gray-50 rounded-full mb-4">
                <Image className="w-10 h-10 text-gray-400" />
              </div>
              <p className="text-gray-600 text-lg">No carousel images yet</p>
              <p className="text-gray-400 text-sm mt-2">Add your first image to get started</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {carousels.map((c) => (
                <li
                  key={c._id}
                  onMouseEnter={() => setHoveredId(c._id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className="bg-white rounded-lg border border-gray-200 overflow-hidden"
                >
                  <div className="flex items-center gap-4 p-4">
                    <div className="flex-shrink-0 overflow-hidden rounded-md">
                      <img src={c.image} alt="" className="h-24 w-40 object-cover" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-700 truncate">{c.image}</p>
                      <p className="text-xs text-gray-500 mt-1">ID: {c._id}</p>
                      <p className="text-xs text-gray-500 mt-1">Redirect: {c.redirectUrl || "-"}</p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => openUpdateDialog(c)}
                        title="Update image"
                        className="bg-yellow-500 text-white px-3 py-2 rounded-md"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDelete(c._id)}
                        title="Delete image"
                        className="bg-red-600 text-white px-3 py-2 rounded-md"
                      >
                        {isDeleting && deletingId === c._id ? (
                          <span className="inline-block w-4 h-4 border-2 border-white rounded-full border-t-transparent" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Update Modal (simple, no animations) */}
      {updatingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md border border-gray-200">
            <h3 className="text-lg font-medium mb-4">Update Carousel Image</h3>

            <label className="block text-sm text-gray-600 mb-2">Replace Image (optional)</label>
            <input type="file" accept="image/*" ref={updateFileRef} className="mb-3" />

            <label className="block text-sm text-gray-600 mb-2">Redirect URL</label>
            <input
              value={updatingItem.redirectUrl}
              onChange={(e) => setUpdatingItem({ ...updatingItem, redirectUrl: e.target.value })}
              className="w-full border border-gray-200 rounded-md p-3 mb-4"
            />

            <div className="flex justify-end gap-3">
              <button onClick={() => setUpdatingItem(null)} className="px-4 py-2 rounded-md bg-gray-100">Cancel</button>
              <button onClick={handleUpdateSubmit} disabled={isUpdating} className="px-4 py-2 rounded-md bg-yellow-500 text-white">
                {isUpdating ? "Updating..." : "Update"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
