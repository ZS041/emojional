import type { PropsWithChildren } from "react";

export const PageLayout = (props: PropsWithChildren) => {
  return (
    <main className="flex h-screen justify-center ">
      <div className="hidden w-full md:flex md:max-w-2xl">Nav Menu</div>
      <div className="h-full w-full min-w-full overflow-y-scroll border-x border-slate-400 md:min-w-[550px] md:max-w-2xl">
        {props.children}
      </div>
      <div className="hidden w-full md:flex md:max-w-2xl">
        Related Posts/Tags, Search{" "}
      </div>
    </main>
  );
};
