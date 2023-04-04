import { api } from "~/utils/api";

export const RightBar = () => {
  const { data, isLoading: postsLoading } = api.posts.getAll.useQuery();
  console.log(data);

  return <div>Hello</div>;
};
