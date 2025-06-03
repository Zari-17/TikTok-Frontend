import Video from "@/components/app/Video";
import CenterModal from "@/components/global/CenterModal";
import AppLayout from "@/components/layout/AppLayout";
import { cookies_keys } from "@/constants";
import { useFiltersContext } from "@/context/FiltersContext";
import { useUserContext } from "@/context/UserContext";
import { getResourceUrl, getUser, getVideos, getVideoTags } from "@/utils/api-helpers";
import { serverCookieManager } from "@/utils/cookie-manager";
import classNames from "classnames";
import { NextPageContext } from "next";
import React, { useEffect, useState } from "react";

interface Props {
  user: User | null;
}
const ExplorePage = ({ user }: Props) => {
  useUserContext().setUser(user);
  const [category, setCategory] = useState(0);
  const { search, setSearch } = useFiltersContext();
  const [videoModal, setVideoModal] = useState<Video | null>(null);

  const [videos, setVideos] = React.useState<Video[]>([]);

  useEffect(() => {
    getVideos(1, 1000, search).then((res) => {
      setVideos(res);
    });
  }, [search]);

  const [tags, setTags] = useState<{ label: string; value: number }[]>([]);

  useEffect(() => {
    getVideoTags().then((res) => {
      setTags(
        res.data.map((tag) => ({
          label: tag.tag,
          value: tag.id,
        }))
      );
    });
  }, []);

  return (
    <>
      <CenterModal
        isOpen={!!videoModal}
        setOpen={(b) => {
          setVideoModal(null);
        }}
      >
        <div className="px-4 w-screen bg-app-gray bg-opacity-50">
          {videoModal && (
            <Video
              video={videoModal!}
              index={0}
              onClosePressed={() => {
                setVideoModal(null);
              }}
            />
          )}
        </div>
      </CenterModal>
      <div className=" py-4 w-full overflow-x-hidden">
        <h1 className="text-xl font-bold p-2">You May Like</h1>
        <div
          style={{
            width: "calc(100vw - 245px )",
          }}
          className="flex-1 overflow-x-scroll scrollbar-hide mb-3"
        >
          {/* <div className="flex w-fit">
          {tags.map((tag, i) => (
            <div
            onClick={() => setCategory(i)}
            key={i}
            className={classNames("p-3 bg-app-gray-2 mr-3 rounded-md cursor-pointer hover:bg-opacity-45", {
              "bg-white text-app-gray-2": i === category,
              })}
              >
              <h1 className="text-sm font-bold">{tag.label}</h1>
              </div>
              ))}
              </div> */}
        </div>
        {videos.length === 0 && <h1 className="text-xl p-2 text-app-gray">No Videos</h1>}
        {videos.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 md:grid-cols-3 gap-4 w-full p-2">
            {videos.map((v, i) => (
              <div
                className="mb-4 hover:scale-110 duration-200 cursor-pointer"
                onClick={() => {
                  setVideoModal(v);
                }}
                key={i}
              >
                <div className="w-full aspect-[3/4] rounded-xl overflow-hidden">
                  <video src={getResourceUrl(v?.media?.url)} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h1 className="text-sm  font-semibold mt-2">@{v.user.username}</h1>
                  <p className=" max-h-10 text-xs">{v.title}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default ExplorePage;
ExplorePage.Layout = AppLayout;

export const getServerSideProps = async (context: NextPageContext) => {
  const token = await serverCookieManager(context).get(cookies_keys.USER_TOKEN);
  const user = await getUser(token || "");

  return {
    props: {
      user,
    },
  };
};
