interface Api_LOGIN_payload {
  identifier: string;
  password: string;
}

interface Api_LOGIN_response {
  jwt: string;
  user: User;
}

interface Api_SIGNUP_payload {
  username: string;
  email: string;
  password: string;
}

interface Api_SIGNUP_response {
  jwt: string;
  user: User;
}

interface Api_VIDEO_UPLOAD_payload {
  data: {
    title: string;
    description: string;
    media: string;
  };
}

interface Api_CREATE_RATING_payload {
  data: {
    rating: number;
    video: number;
  };
}

interface Api_CREATE_COMMENT_payload {
  data: {
    comment: string;
    video: number;
  };
}

interface User {
  id: number;
  documentId: string;
  username: string;
  email: string;
  provider: string;
  confirmed: boolean;
  blocked: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  userRole: "CREATOR" | "CONSUMER";
}

interface Video {
  id: number;
  title: string;
  description: string;
  activeStatus: "ACTIVE" | "INACTIVE" | "DELETED";
  viewCount: number;
  createdAt: string;
  media: {
    url: string;
  };
  user: User;
  videoTags: {
    id: number;
    tag: string;
  }[];
}

interface Comment {
  user?: User;
  text: string;
}

interface LikeComment {
  comments: number;
  likes: number;
  isLikedByYou: boolean;
}
