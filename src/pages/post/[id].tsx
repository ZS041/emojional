import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { api } from "~/utils/api";

import { PageLayout } from "~/components/layout";

import { generateSSGHelper } from "~/server/helpers/ssgHelper";
import { PostView } from "~/components/postview";
import Link from "next/link";
import { LoadingPage } from "~/components/loading";
import dayjs from "dayjs";

const RepliesView = (props: { id: string }) => {
  const { data, isLoading } = api.replies.getRepliesByPostId.useQuery({
    postId: props.id,
  });

  if (isLoading) return <LoadingPage />;
  if (!data || data.length === 0) return <div>Post has no replies</div>;
  return (
    <div>
      {data.map((replyData) => (
        <ReplyView
          key={replyData.reply.id}
          reply={replyData.reply}
          author={replyData.author}
        />
      ))}
    </div>
  );
};

type ReplyType = {
  id: string;
  createdAt: Date;
  content: string;
  authorId: string;
  postId: string;
};

type AuthorType = {
  id: string;
  username: string;
  // Include any other necessary properties for the author here
};

const ReplyView = ({
  reply,
  author,
}: {
  reply: ReplyType;
  author: AuthorType;
}) => {
  return (
    <div key={reply.id} className=" border-b border-slate-400 p-4">
      <div className="flex gap-3">
        <div className="flex flex-col">
          <div className="flex gap-1 text-slate-400">
            <Link href={`/@${author.username}`}>
              <span> {`@${author.username}`}</span>
            </Link>

            <span className="font-thin">{` · ${dayjs(
              reply.createdAt
            ).fromNow()}`}</span>
          </div>
          <div>
            <span className="text-xl">{reply.content}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const SinglePostPage: NextPage<{ id: string }> = ({ id }) => {
  const { data } = api.posts.getById.useQuery({
    id,
  });

  if (!data) return <div>404</div>;
  return (
    <>
      <Head>
        <title>{`${data.post.content} - @${data.author.username}`}</title>
      </Head>

      <PageLayout>
        <div className="flex h-14  items-center justify-start">
          <div className="flex items-center justify-center p-4">
            <Link href="/">
              <button
                type="button"
                className=" mr-2 inline-flex rotate-180 items-center rounded-full  p-2.5 text-center text-sm font-medium text-white hover:bg-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-300 dark:bg-stone-600 dark:hover:bg-stone-700 dark:focus:ring-stone-800"
              >
                <svg
                  aria-hidden="true"
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                <span className="sr-only"></span>
              </button>
            </Link>
          </div>
          <div className="flex flex-col items-start justify-center text-xl font-semibold">
            Emojion
          </div>
        </div>
        <PostView {...data} />
        <RepliesView id={id} />
      </PageLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateSSGHelper();

  const id = context.params?.id;

  if (typeof id !== "string") throw new Error("no slug");

  await ssg.posts.getById.prefetch({ id });
  return {
    props: {
      trpcState: ssg.dehydrate(),
      id,
    },
  };
};

export const getStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};
export default SinglePostPage;
