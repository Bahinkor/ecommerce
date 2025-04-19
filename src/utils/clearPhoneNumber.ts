import type { Comment } from "../comments/entities/comment.entity";

const clearPhoneNumber = (comments: Comment[]): void => {
  comments.forEach((comment: Comment) => {
    delete comment.user.phoneNumber;
    comment.replies.forEach((reply: Comment) => {
      delete reply.user.phoneNumber;
    });
  });
};

export { clearPhoneNumber };
