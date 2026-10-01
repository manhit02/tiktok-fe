"use client";

import { useEffect, useRef, useState } from "react";

import {
  getComments,
  createComment,
  deleteComment,
  updateComment,
} from "@/api/video";

import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
interface Comment {
  id: string;
  content: string;
  userId: string;
  username: string;
  avatar: string;
}

interface CommentSectionProps {
  videoId: string;
  onClose: () => void;
  onCommentCountChange: (count: number) => void;
}

export default function CommentSection({
  videoId,
  onClose,
  onCommentCountChange,
}: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [content, setContent] = useState("");
  const [contentEdit, setContentEdit] = useState("");
  const [idComment, setIdComment] = useState("");
  const { user, isLoggedIn } = useSelector((state: RootState) => state.auth);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await getComments(videoId);
        setComments(res.data.data);
      } catch (error) {
        console.log("Lỗi lấy comment:", error);
      }
    };

    fetchComments();
  }, [videoId]);

  const handleComment = async () => {
    if (isSubmitting) return;
    if (!content.trim()) return;

    try {
      setIsSubmitting(true);
      const res = await createComment(videoId, content);

      setComments((prev) => [res.data.data, ...prev]);
      onCommentCountChange(comments.length + 1);
      setContent("");
    } catch (error) {
      console.log("Lỗi comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleSelectComment = async (commentId: string, action: string) => {
    const dataComment = comments.find((comment) => comment.id === commentId);
    if (!dataComment) return;
    if (action === "edit") {
      setContentEdit(dataComment.content);
      setIdComment(commentId);
    }
    if (action === "delete") {
      try {
        await deleteComment(videoId, commentId);
        setComments((prev) => {
          const newComments = prev.filter(
            (comment) => comment.id !== commentId,
          );

          onCommentCountChange(newComments.length);

          return newComments;
        });
      } catch (error) {
        console.log("Lỗi xóa comment:", error);
      }
    }
  };
  const handleEditComment = async (commentId: string) => {
    if (isSubmitting) return;
    try {
      setIsSubmitting(true);
      await updateComment(videoId, commentId, contentEdit);
      setComments((prev) =>
        prev.map((comment) =>
          comment.id === commentId
            ? { ...comment, content: contentEdit }
            : comment,
        ),
      );
      setIdComment("");
      setContentEdit("");
    } catch (error) {
      console.log("Lỗi sửa comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-80 rounded-xl border bg-white dark:bg-black p-4">
      <div className="mb-4 text-lg font-bold flex items-center justify-content-between w-full">
        Bình luận{" "}
        <button onClick={onClose} className="cursor-pointer ml-auto">
          X
        </button>
      </div>

      <div className="mb-4 max-h-96 space-y-3 overflow-y-auto">
        {comments.map((comment) => (
          <div key={comment.id}>
            <div className="flex items-center justify-between">
              <p className="font-semibold">@{comment.username}</p>
              {user && user.id === comment.userId && (
                <>
                  <select
                    onChange={(e) => {
                      handleSelectComment(comment.id, e.target.value);
                    }}
                    value=""
                    className="border border-gray-400 rounded-md border-none outline-0 p-1 appearance-none cursor-pointer bg-white dark:bg-black"
                  >
                    <option value="">...</option>
                    <option value="edit">sửa</option>
                    <option value="delete">xóa</option>
                  </select>
                </>
              )}
            </div>

            <p className="text-sm text-gray-600">{comment.content}</p>
          </div>
        ))}

        {comments.length === 0 && (
          <p className="text-sm text-gray-400">Chưa có bình luận</p>
        )}
      </div>

      <div className="flex gap-2">
        {idComment !== "" ? (
          <>
            <input
              type="text"
              value={contentEdit}
              onChange={(e) => setContentEdit(e.target.value)}
              className="rounded-lg bg-black px-3 py-2 text-white"
            />
            <button
              className="cursor-pointer"
              onClick={() => handleEditComment(idComment)}
            >
              Xác nhận
            </button>
            <button className="cursor-pointer" onClick={() => setIdComment("")}>
              Hủy
            </button>
          </>
        ) : (
          <>
            {isLoggedIn ? (
              <>
                <input
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleComment();
                    }
                  }}
                  placeholder="Viết bình luận..."
                  className="min-w-0 flex-1 rounded-lg border px-3 py-2 outline-none"
                />
                <button
                  onClick={handleComment}
                  className="rounded-lg bg-black px-3 py-2 text-white"
                >
                  Gửi
                </button>
              </>
            ) : (
              <button
                className="cursor-pointer"
                onClick={() => router.push("/login")}
              >
                Đăng nhập để bình luận
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
