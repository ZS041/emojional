import type { PropsWithChildren } from "react";
import { RightBar } from "./rightbar";

export const PageLayout = (props: PropsWithChildren) => {
  return (
    <main className="flex h-screen justify-center ">
      <div className="hidden w-full md:flex md:max-w-2xl"></div>
      <div className="h-full w-full min-w-full overflow-y-scroll border-x border-slate-400 md:min-w-[550px] md:max-w-2xl">
        {props.children}
      </div>
      <div className="hidden w-full md:flex md:max-w-2xl"></div>
    </main>
  );
};
