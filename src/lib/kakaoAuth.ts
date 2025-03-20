// Kakao OAuth API helper functions

// Kakao OAuth configuration
const KAKAO_CLIENT_ID = "YOUR_KAKAO_CLIENT_ID";
const KAKAO_REDIRECT_URI = window.location.origin + "/auth/kakao-callback";

/**
 * Get the Kakao authorization URL
 * @param scopes Optional additional scopes to request
 * @returns The full Kakao authorization URL
 */
export const getKakaoAuthUrl = (scopes: string[] = []) => {
  const defaultScopes = ["profile_nickname", "profile_image", "account_email"];
  const allScopes = [...new Set([...defaultScopes, ...scopes])].join(",");

  return `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${KAKAO_REDIRECT_URI}&response_type=code&scope=${allScopes}`;
};

/**
 * Exchange authorization code for access token
 * Note: In a real application, this should be done on the server side
 * to keep the client_secret secure
 *
 * @param code The authorization code from Kakao
 * @returns The access token and user info
 */
export const exchangeCodeForToken = async (code: string) => {
  // This is a mock implementation
  // In a real app, you would send this code to your backend
  console.log("Exchanging code for token:", code);

  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Mock response
  return {
    access_token:
      "mock_access_token_" + Math.random().toString(36).substring(2),
    refresh_token:
      "mock_refresh_token_" + Math.random().toString(36).substring(2),
    expires_in: 21599,
  };
};

/**
 * Get user profile from Kakao API
 * @param accessToken The Kakao access token
 * @returns User profile information
 */
export const getKakaoUserProfile = async (accessToken: string) => {
  // This is a mock implementation
  // In a real app, you would call Kakao API with the access token
  console.log("Getting user profile with token:", accessToken);

  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Mock user data
  return {
    id: "kakao_" + Math.floor(Math.random() * 1000000),
    kakao_account: {
      profile: {
        nickname: "카카오 사용자",
        profile_image_url:
          "https://api.dicebear.com/7.x/avataaars/svg?seed=kakao",
      },
      email: "user@example.com",
    },
    provider: "kakao",
  };
};

/**
 * Check if a user exists in the database
 * @param kakaoId The Kakao user ID
 * @returns Whether the user exists and user data if found
 */
export const checkUserExists = async (kakaoId: string) => {
  // This is a mock implementation
  // In a real app, you would check your database
  console.log("Checking if user exists:", kakaoId);

  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  // Mock response - randomly return true or false
  const exists = Math.random() > 0.5;

  return {
    exists,
    userData: exists
      ? {
          id: kakaoId,
          name: "카카오 사용자",
          email: "user@example.com",
          profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=kakao",
          provider: "kakao",
        }
      : null,
  };
};

/**
 * Register a new user in the database
 * @param userData The user data from Kakao
 * @returns The newly created user
 */
export const registerNewUser = async (userData: any) => {
  // This is a mock implementation
  // In a real app, you would save to your database
  console.log("Registering new user:", userData);

  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Mock response
  return {
    id: userData.id,
    name: userData.kakao_account.profile.nickname,
    email: userData.kakao_account.email,
    profileImage: userData.kakao_account.profile.profile_image_url,
    provider: "kakao",
    createdAt: new Date().toISOString(),
  };
};
