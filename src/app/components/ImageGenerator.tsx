"use client";

import { useState, useEffect } from "react";
import { fetchImages } from "../actions/generateImage";
import { Search, Heart, Share2, MessageCircle } from "lucide-react";

interface ImageGeneratorProps {
  generateImage: (
    inputText: string
  ) => Promise<{ success: boolean; imageUrl?: string; error?: string }>;
}

interface Comment {
  id: string;
  content: string;
}
interface Image {
  id: string;
  imageUrl: string;
  prompt: string;
  likes: number;
  comments: Comment[];
}

export default function ImageGenerator({ generateImage }: ImageGeneratorProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [inputText, setInputText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<Array<Image>>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    const response = await fetchImages();
    if (response.success) {
      setImages(response.images);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const data = await generateImage(inputText);
      if (!data.success) {
        throw new Error(data.error || "Failed to generate image");
      }
      await loadImages();
      setInputText("");
    } catch (error) {
      console.error("Error:", error);
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `/api/search?q=${encodeURIComponent(searchQuery)}`
      );
      const data = await response.json();
      if (data.success) {
        setImages(data.images);
      }
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  const handleLike = async (imageId: string) => {
    await fetch(`/api/images/${imageId}`, {
      method: "POST",
      body: JSON.stringify({ action: "like" }),
    });
    await loadImages();
  };

  const handleComment = async (imageId: string, comment: string) => {
    await fetch(`/api/images/${imageId}`, {
      method: "POST",
      body: JSON.stringify({ action: "comment", comment }),
    });
    await loadImages();
  };

  const shareImage = async (prompt: string, imageUrl: string) => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: prompt,
          text: "Check out this AI generated image!",
          url: imageUrl,
        });
      } else {
        // Fallback: Copy to clipboard
        await navigator.clipboard.writeText(imageUrl);
        alert("Image URL copied to clipboard!");
      }
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        // User cancelled share - do nothing
        return;
      }
      console.error("Error sharing:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-purple-800 dark:text-purple-200">
          AI Image Generator
        </h1>

        {error && (
          <div className="w-full max-w-3xl mx-auto mb-6 p-4 bg-red-100 text-red-700 rounded-lg shadow-lg">
            {error}
          </div>
        )}

        <div className="mb-6">
          <form
            onSubmit={handleSearch}
            className="flex gap-2 max-w-3xl mx-auto"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="flex-1 p-3 rounded-lg bg-white dark:bg-purple-800 border-2 border-purple-200 dark:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Search images..."
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>
          </form>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
          {images.map(image => (
            <div
              key={image.id}
              className="relative rounded-xl overflow-hidden shadow-lg transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
            >
              <img
                src={image.imageUrl}
                alt={image.prompt}
                className="w-full h-64 object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-purple-900/90 to-transparent p-4">
                <p className="text-sm text-white font-medium mb-2">
                  {image.prompt}
                </p>
                <div className="flex items-center gap-4 text-white">
                  <button
                    onClick={() => handleLike(image.id)}
                    className="flex items-center gap-1 hover:text-purple-300 transition-colors"
                  >
                    <Heart
                      className={`w-4 h-4 ${image.likes > 0 ? "fill-current" : ""}`}
                    />
                    <span>{image.likes || 0}</span>
                  </button>
                  <button
                    onClick={() => setSelectedImage(image.id)}
                    className="flex items-center gap-1 hover:text-purple-300 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>{image.comments?.length || 0}</span>
                  </button>
                  <button
                    onClick={() => shareImage(image.prompt, image.imageUrl)}
                    className="flex items-center gap-1 hover:text-purple-300 transition-colors"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Comments section */}
                {selectedImage === image.id && (
                  <div className="mt-4 bg-white/10 rounded-lg p-3">
                    {image.comments?.map((comment: Comment) => (
                      <div key={comment.id} className="text-white text-sm mb-2">
                        {comment.content}
                      </div>
                    ))}
                    <form
                      onSubmit={e => {
                        e.preventDefault();
                        const input = e.currentTarget.elements.namedItem(
                          "comment"
                        ) as HTMLInputElement;
                        if (input.value) {
                          handleComment(image.id, input.value);
                          input.value = "";
                        }
                      }}
                      className="flex gap-2"
                    >
                      <input
                        type="text"
                        name="comment"
                        className="flex-1 bg-white/20 rounded px-2 py-1 text-white text-sm"
                        placeholder="Add a comment..."
                      />
                      <button
                        type="submit"
                        className="text-sm bg-purple-500 px-2 py-1 rounded hover:bg-purple-600"
                      >
                        Post
                      </button>
                    </form>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-purple-900/80 backdrop-blur-md p-6 shadow-lg">
          <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto">
            <div className="flex gap-3">
              <input
                type="text"
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                className="flex-1 p-4 rounded-lg bg-white dark:bg-purple-800 border-2 border-purple-200 dark:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 shadow-sm text-purple-900 dark:text-white placeholder-purple-400 dark:placeholder-purple-300"
                placeholder="Describe the image you want to generate..."
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading}
                className="px-8 py-4 rounded-lg bg-purple-600 text-white hover:bg-purple-700 dark:hover:bg-purple-500 transition-colors disabled:opacity-50 disabled:hover:bg-purple-600 font-medium shadow-sm"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Generating...</span>
                  </div>
                ) : (
                  "Generate"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
