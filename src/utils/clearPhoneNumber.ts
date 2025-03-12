import type { Comment } from "../comments/entities/comment.entity";

const clearPhoneNumber = (comments: Comment[]): void => {
  comments.forEach((comment: Comment) => {
    delete comment.user.phone_number;
    comment.replies.forEach((reply: Comment) => {
      delete reply.user.phone_number;
    });
  });
};

export { clearPhoneNumber };
