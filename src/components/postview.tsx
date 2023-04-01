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

import { SignInButton } from "@clerk/nextjs";
dayjs.extend(relativeTime);

import toast from "react-hot-toast";

import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";

type ReplyModalProps = {
  postId: string;

  toggleReplyModal: () => void;
};
const ReplyModal = ({ postId, toggleReplyModal }: ReplyModalProps) => {
  const [open, setOpen] = useState(true);

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={toggleReplyModal}>
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
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-slate-800 px-4 pb-4  text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                <div>
                  <div className=" text-center ">
                    <div className="">
                      <CreateReplyWizard
                        postId={postId}
                        toggleReplyModal={toggleReplyModal}
                      />
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

type PostWithUser = RouterOutputs["posts"]["getAll"][number];

type CreateReplyWizardProps = {
  postId: string;
  toggleReplyModal: () => void; // Add toggleReplyModal as a prop
};

const CreateReplyWizard = ({
  postId,
  toggleReplyModal,
}: CreateReplyWizardProps) => {
  const { user } = useUser();

  const ctx = api.useContext();

  const { mutate, isLoading: isPosting } = api.replies.createReply.useMutation({
    onSuccess: () => {
      setInput("");
      void ctx.replies.getRepliesByPostId.invalidate();
      toggleReplyModal(); // call toggleReplyModal function to close the modal
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
  const [showReplyModal, setShowReplyModal] = useState(false);

  const toggleReplyModal = () => {
    setShowReplyModal(!showReplyModal);
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
        {showReplyModal && (
          <ReplyModal postId={post.id} toggleReplyModal={toggleReplyModal} />
        )}

        <button onClick={toggleReplyModal}>
          <Image src={chatBubble} alt="Reply" height={18} width={18} />
        </button>
      </div>
    </div>
  );
};
