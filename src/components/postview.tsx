/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Image from "next/image";

dayjs.extend(relativeTime);

import { api, type RouterOutputs } from "~/utils/api";

import Link from "next/link";
import chatBubble from "~/images/UI/chatbubble.svg";

import { useUser } from "@clerk/nextjs";

import { LoadingSpinner } from "~/components/loading";
import { useState } from "react";

dayjs.extend(relativeTime);

import toast from "react-hot-toast";

type PostWithUser = RouterOutputs["posts"]["getAll"][number];
type CreateReplyWizardProps = {
  postId: string;
};

const CreateReplyWizard = ({ postId }: CreateReplyWizardProps) => {
  const { user } = useUser();

  const ctx = api.useContext();

  const { mutate, isLoading: isPosting } = api.replies.createReply.useMutation({
    onSuccess: () => {
      setInput("");
      void ctx.replies.getRepliesByPostId.invalidate();
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors.content;
      if (errorMessage && errorMessage[0]) {
        toast.error(errorMessage[0]);
      } else {
        toast.error("Failed to post. Something went wrong.");
      }
    },
  });

  const [input, setInput] = useState("");

  console.log(user);

  if (!user) return null;

  return (
    <div className="flex w-full gap-3">
      <input
        placeholder="Type some emojis!"
        className="grow bg-transparent outline-none"
        value={input}
        type="text"
        onChange={(e) => setInput(e.target.value)}
        disabled={isPosting}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            if (input !== "") {
              mutate({ content: input, postId: postId });
            }
          }
        }}
      />
      {input !== "" && !isPosting && (
        <button
          onClick={() => {
            mutate({ content: input, postId: postId });
          }}
        >
          Post
        </button>
      )}
      {isPosting && (
        <div className="flex items-center justify-center">
          <LoadingSpinner size={20} />
        </div>
      )}
    </div>
  );
};

export const PostView = (props: PostWithUser) => {
  const { post, author } = props;
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
      <div className="flex h-3 justify-between px-[72px] align-bottom">
        <CreateReplyWizard postId={post.id} />
        <button>
          <Image src={chatBubble} alt="Reply" height={18} width={18} />
        </button>
      </div>
    </div>
  );
};
