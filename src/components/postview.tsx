/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Image from "next/image";

dayjs.extend(relativeTime);

import { api, type RouterOutputs } from "~/utils/api";

import Link from "next/link";
import chatBubble from "~/images/UI/chatbubble.svg";

dayjs.extend(relativeTime);

import { ReplyModal } from "./replymodal";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import toast from "react-hot-toast";

import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";

type PostWithUser = RouterOutputs["posts"]["getAll"][number];

export const PostView = (props: PostWithUser) => {
  const { post, author } = props;
  const [open, setOpen] = useState(false);
  const { data: replyCount } = api.replies.getReplyCountByPostId.useQuery(
    { postId: post.id },
    {
      enabled: true,
    }
  );
  type CreateLikeWizardProps = {
    post: PostWithUser;
  };
  const { data: likesCount } = api.likes.countLikes.useQuery(
    { postId: post.id },
    { enabled: true }
  );

  const CreateLikeWizard = ({ post }: CreateLikeWizardProps) => {
    const { user } = useUser();
    const ctx = api.useContext();
    const createLikeMutation = api.likes.create.useMutation({
      onSuccess: () => {
        console.log("like created");
        void ctx.likes.countLikes.invalidate();
      },
      onError: (e) => {
        const errorMessage = e.data?.zodError?.fieldErrors.content;
        if (errorMessage && errorMessage[0]) {
          toast.error(errorMessage[0]);
        } else {
          toast.error("Failed to like. Something went wrong.");
        }
      },
    });

    const deleteLikeMutation = api.likes.delete.useMutation({
      onSuccess: () => {
        console.log("like deleted");
        void ctx.likes.countLikes.invalidate();
      },
      onError: (e) => {
        toast.error("Failed to unlike. Something went wrong.");
      },
    });

    let hasLikedData;
    if (user) {
      const { data: hasLiked } = api.likes.hasLiked.useQuery(
        { postId: post.post.id },
        { enabled: true }
      );
      hasLikedData = hasLiked;
    }

    console.log(user);

    return (
      <div className="flex w-full gap-3">
        {user && hasLikedData ? (
          <button
            onClick={() => deleteLikeMutation.mutate({ postId: post.post.id })}
          >
            <AiFillHeart size={20} />
          </button>
        ) : (
          <button
            onClick={() => createLikeMutation.mutate({ postId: post.post.id })}
          >
            <AiOutlineHeart size={20} />
          </button>
        )}
      </div>
    );
  };
  return (
    <div key={post.id} className=" border-b border-slate-400 p-4">
      <div className="flex gap-3">
        <Image
          src={author.profileImageUrl}
          alt={`@${author.username}'s profile image`}
          className="h-14 w-14 rounded-full"
          width={56}
          height={56}
        />
        <div className="flex flex-col">
          <div className="flex gap-1 text-slate-400">
            <Link href={`/@${author.username}`}>
              <span> {`@${author.username}`}</span>
            </Link>
            <Link href={`/post/${post.id}`}>
              <span className="font-thin">{` · ${dayjs(
                post.createdAt
              ).fromNow()}`}</span>
            </Link>
          </div>
          <div>
            <span className="text-xl">{post.content}</span>
          </div>
        </div>
      </div>
      <div className="flex h-5 justify-between px-[72px] align-bottom">
        <ReplyModal post={props} open={open} onClose={() => setOpen(false)} />
        <div className="flex flex-row items-center justify-center gap-4">
          <button
            className="flex flex-row items-center justify-center gap-2 "
            onClick={() => setOpen(true)}
          >
            <Image src={chatBubble} alt="Reply" height={18} width={18} />
            <span>{replyCount !== 0 && replyCount}</span>
          </button>
          <div className="flex flex-row items-center justify-center gap-2">
            <CreateLikeWizard post={props} />
            <span>{likesCount !== 0 && likesCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
