import type { Comment } from "src/comments/entities/comment.entity";

const clearPhoneNumber = (comments: Comment[]): void => {
  comments.forEach((comment: Comment) => {
    comment.user.phone_number = "";
    comment.replies.forEach((reply: Comment) => {
      reply.user.phone_number = "";
    });
  });
};

export { clearPhoneNumber };
