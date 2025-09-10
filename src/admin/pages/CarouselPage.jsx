import React, { useState } from "react";
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

  if (isLoading) return <p>Loading...</p>;

  const handleAdd = async () => {
    if (!newImage) return;
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
      await deleteCarouselImage(id);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Manage Carousel</h1>

      {/* Add Image */}
      <div className="mb-6 space-x-2">
        <input
          className="border p-2"
          placeholder="Image URL"
          value={newImage}
          onChange={(e) => setNewImage(e.target.value)}
        />
        <button
          onClick={handleAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add
        </button>
      </div>

      {/* List */}
      <ul className="space-y-2">
        {carousels.map((c) => (
          <li
            key={c._id}
            className="flex justify-between items-center border p-2"
          >
            <img src={c.image} alt="" className="h-16" />
            <div className="space-x-2">
              <button
                onClick={() => handleUpdate(c._id)}
                className="bg-yellow-500 px-3 py-1 text-white"
              >
                Update
              </button>
              <button
                onClick={() => handleDelete(c._id)}
                className="bg-red-600 px-3 py-1 text-white"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
