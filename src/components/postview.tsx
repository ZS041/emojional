/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Image from "next/image";

dayjs.extend(relativeTime);
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { api, type RouterOutputs } from "~/utils/api";

import Link from "next/link";
import chatBubble from "~/images/UI/chatbubble.svg";

import { useUser } from "@clerk/nextjs";

import { LoadingSpinner } from "~/components/loading";

import { SignInButton } from "@clerk/nextjs";
dayjs.extend(relativeTime);

import toast from "react-hot-toast";

import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";

import { ReplyModal } from "./replymodal";

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
        <button>LIKES GO HERE</button>
        <button
          className="flex flex-row items-center gap-2 "
          onClick={() => setOpen(true)}
        >
          <Image src={chatBubble} alt="Reply" height={18} width={18} />
          <span>{replyCount !== 0 && replyCount}</span>
        </button>
      </div>
    </div>
  );
};
