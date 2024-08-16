"use client";

import { useEffect, useState } from 'react';
import api from '@/utils/api';
import { API_COMMENTS, API_LIKES, API_POSTS } from '@/constants/routes';
import getUser from '@/utils/getUser';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';

interface Comment {
  id: number;
  content: string;
  postId: number;
  userId: number;
  updatedAt: string;
  createdAt: string;
}

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

interface PostModalProps {
  post: Post;
  onClose: () => void;
}

interface User {
  id: number;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

const PostModal = ({ post, onClose }: PostModalProps) => {
  const [likes, setLikes] = useState<number>(0);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [commentText, setCommentText] = useState<string>("");
  const [user, setUser] = useState<User>();
  const [hasLiked, setHasLiked] = useState<boolean>(false);

  useEffect(() => {
    const user = getUser();
    setUser(user);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [likesData, commentsData] = await Promise.all([
          api.get<object>(`${API_POSTS}/${post.id}${API_LIKES}`),
          api.get<Comment[]>(`${API_POSTS}/${post.id}${API_COMMENTS}`),
        ]);

        setLikes(likesData?.length ?? 0);
        setComments(commentsData);

        const userHasLiked = likesData?.some((like: any) => like.userId === user?.id);

        setHasLiked(userHasLiked ?? false);
      } catch (error) {
        console.error('Erro ao carregar likes e comentários', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [post.id, user?.id]);

  const handleLike = async () => {
    try {
      await api.post(`${API_LIKES}`, { postId: post.id });
      if (hasLiked) {
        setLikes(likes - 1);
        setHasLiked(false);
      } else {
        setLikes(likes + 1);
        setHasLiked(true);
      }
    } catch (error) {
      console.error('Erro ao curtir o post', error);
    }
  };

  const handleComment = async () => {
    if (commentText.trim() === "") return;
    try {
      const newComment = await api.post<Comment>(`${API_COMMENTS}`, { content: commentText, postId: post.id });
      newComment.user = user;
      setComments([...comments, newComment]);
      setCommentText("");
    } catch (error) {
      console.error('Erro ao comentar no post', error);
    }
  };

  if (loading) return <div>Carregando...</div>;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 text-black">
      <div className="bg-white rounded-lg overflow-hidden shadow-lg w-full max-w-3xl relative">
        <div className="flex">
          <img
            src={`${process.env.NEXT_PUBLIC_BASE_URL}/${post.imageUrl}`}
            alt={post.caption}
            className="object-cover w-1/2 h-auto"
          />
          <div className="p-4 w-1/2">
            <h2 className="text-xl font-bold">{post.user.name}</h2>
            <p className="mt-2">{post.caption}</p>
            <button
              onClick={handleLike}
              className={`${hasLiked ? 'text-red-500' : 'text-grey-100'} mt-4 flex items-center`}
            >
              <FontAwesomeIcon icon={faHeart} className="mr-2"/>
              ({likes})
            </button>
            <div className="mt-4">
              <input
                type="text"
                placeholder="Adicionar um comentário..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="border rounded p-2 w-full"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleComment();
                  }
                }}
              />
              <div className="mt-2">
                {comments.map(comment => {

                  console.log(comment)
                  return(
                  <div key={comment.id} className="mt-1">
                    <strong>{comment?.user?.name}</strong>: {comment.content}
                  </div>
                )})}
              </div>
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="absolute top-0 right-0 m-4 text-2xl font-bold"
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default PostModal;
