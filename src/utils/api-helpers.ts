import { cookies_keys } from "@/constants";
import { clientCookieManager } from "./cookie-manager";
import api, { endPoints, getAuthHeader } from "./api";

export const getUser = async (userToken: string) => {
  if (!userToken) return null;
  const response = await api.get<User>(endPoints.USER_ME, getAuthHeader(userToken));
  return response.data;
};

export const getUserToken = (): string => {
  return clientCookieManager.get(cookies_keys.USER_TOKEN) as string;
};

export const uploadVideo = async (file: any, token: string) => {
  const formData = new FormData();
  console.log("file :-> ", file);
  formData.append("files", file);

  const response = await api.post<{ id: number }[]>(endPoints.UPLOAD, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.success) {
    return response?.data?.[0]?.id;
  }

  return null;
};

export const getVideoTags = async () => {
  const response = await api.get<{ data: { id: number; tag: string }[] }>(
    `${endPoints.TAGS}?pagination[pageSize]=100`
  );

  return response?.data || [];
};

export const getVideos = async (page: number, pageSize: number, title: string = ""): Promise<Video[]> => {
  const response = await api.get<{ data: Video[] }>(
    `${endPoints.VIDEOS}?pagination[page]=${page}&pagination[pageSize]=${pageSize}&populate=media&populate=user&sort=createdAt:desc&populate=videoTags&filters[title][$containsi]=${title}`
  );

  return response?.data?.data || [];
};

export const getResourceUrl = (url: string) => {
  return `${process.env.NEXT_PUBLIC_API_URL}${url}`;
};

export const getComments = async (videoId: number, page: number, pageSize: number): Promise<Comment[]> => {
  const response = await api.get<{ data: Comment[] }>(
    `${endPoints.COMMENTS}?pagination[page]=${page}&pagination[pageSize]=${pageSize}&populate=user&filters[video]=${videoId}&sort=createdAt:desc`
  );

  return response?.data?.data || [];
};

export const createComment = async (videoId: number, text: string) => {
  const response = await api.post<{ data: Comment }>(
    `${endPoints.COMMENTS}`,
    {
      data: {
        text: text,
        video: videoId,
      },
    },
    getAuthHeader(getUserToken())
  );

  return response;
};

export const getVideRatings = async (videoId: number): Promise<LikeComment> => {
  let response;

  if (getUserToken()) {
    response = await api.get<{ data: LikeComment }>(
      `${endPoints.RATINGS}?videoId=${videoId}`,
      getAuthHeader(getUserToken())
    );
  } else {
    response = await api.get<{ data: LikeComment }>(`${endPoints.RATINGS}?videoId=${videoId}`);
  }

  return (
    response?.data?.data || {
      likes: 0,
      comments: 0,
      isLikedByYou: false,
    }
  );
};

export const likeVideoApi = async (videoId: number, like: boolean) => {
  let result = {
    success: false,
    liked: !like,
  };

  if (like) {
    const response = await api.post<{ data: LikeComment }>(
      `${endPoints.RATINGS}`,
      {
        data: {
          video: videoId,
        },
      },
      getAuthHeader(getUserToken())
    );

    if (response.success) {
      result = {
        success: true,
        liked: like,
      };
    }
  } else {
    const response = await api.delete<{ data: LikeComment }>(
      `${endPoints.RATINGS}/${videoId}`,
      getAuthHeader(getUserToken())
    );

    if (response.success) {
      result = {
        success: true,
        liked: like,
      };
    }
  }

  return result;
};
