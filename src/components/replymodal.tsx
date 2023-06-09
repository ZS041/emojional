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

type PostWithUser = RouterOutputs["posts"]["getAll"][number];

type CreateReplyWizardProps = {
  post: PostWithUser;
  onSubmitSuccess: () => void;
};

const CreateReplyWizard = ({
  post,
  onSubmitSuccess,
}: CreateReplyWizardProps) => {
  const { user } = useUser();

  const ctx = api.useContext();

  const { mutate, isLoading: isPosting } = api.replies.createReply.useMutation({
    onSuccess: () => {
      setInput("");
      void ctx.replies.getRepliesByPostId.invalidate();
      void ctx.replies.getReplyCountByPostId.invalidate();
      onSubmitSuccess();
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

  if (!user)
    return (
      <div className="flex justify-center">
        <SignInButton />
      </div>
    );

  return (
    <div className="flex w-full gap-3">
      <input
        placeholder="Reply with an emoji!"
        className="grow bg-transparent outline-none"
        value={input}
        type="text"
        onChange={(e) => setInput(e.target.value)}
        disabled={isPosting}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            if (input !== "") {
              mutate({ content: input, postId: post.post.id });
            }
          }
        }}
      />
      {input !== "" && !isPosting && (
        <button
          onClick={() => {
            mutate({ content: input, postId: post.post.id });
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

type ReplyModalProps = {
  post: PostWithUser;
  open: boolean;
  onClose: () => void;
};

export const ReplyModal = ({ post, onClose, open }: ReplyModalProps) => {
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative w-full transform overflow-hidden rounded-lg bg-slate-800 p-4  px-4 text-left shadow-xl transition-all sm:my-8 sm:max-w-lg sm:p-6">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-row items-center gap-2">
                    <div className=" rounded-full">
                      <Image
                        src={post.author.profileImageUrl}
                        height={32}
                        width={32}
                        alt="Profile Pic"
                        className=" rounded-full"
                      ></Image>
                    </div>
                    {/*add a template literal with post.author.username with an @ in front of it */}

                    <div>{`@${post.author.username}`}</div>
                  </div>
                  <div>{post.post.content}</div>
                  <div className="border border-b border-slate-500" />
                  <CreateReplyWizard post={post} onSubmitSuccess={onClose} />
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};
