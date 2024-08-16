"use client";

import { useEffect, useState } from 'react';
import api from '@/utils/api';
import { API_POSTS } from '@/constants/routes';
import PostModal from '@/app/components/PostModal';

interface Post {
  id: number;
  caption: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
  userId: number;
  user: {
    id: number;
    name: string;
    email: string;
  };
}

const Feed = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  const fetchPosts = async (page: number) => {
    try {
      setLoading(true);
      const data = await api.get<any>(`${API_POSTS}?page=${page}`);
      setPosts(data.posts);
      setTotalPages(data.totalPages);
    } catch (error) {
      setError('Erro ao carregar posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(page);
  }, [page]);

  const openModal = (post: Post) => {
    setSelectedPost(post);
  };

  const closeModal = () => {
    setSelectedPost(null);
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  if (loading && page === 1) return <div>Carregando...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="p-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {posts.map(post => (
          <div
            key={post.id}
            className="bg-white border rounded-lg overflow-hidden shadow-md cursor-pointer"
            onClick={() => openModal(post)}
          >
            <img
              src={`${process.env.NEXT_PUBLIC_BASE_URL}/${post.imageUrl}`}
              alt={post.caption}
              className="object-cover w-full h-48"
            />
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center mt-4">
        <button
          onClick={handlePreviousPage}
          disabled={page === 1}
          className={`px-4 py-2 bg-blue-500 text-white rounded ${page === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          Left
        </button>

        <span>Página {page} de {totalPages}</span>

        <button
          onClick={handleNextPage}
          disabled={page === totalPages}
          className={`px-4 py-2 bg-blue-500 text-white rounded ${page === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          Right
        </button>
      </div>

      {loading && page > 1 && <div>Carregando mais posts...</div>}

      {selectedPost && (
        <PostModal post={selectedPost} onClose={closeModal} />
      )}
    </div>
  );
};

export default Feed;
