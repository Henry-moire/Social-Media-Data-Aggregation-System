import React from "react";

export default function RedditLogin() {
  const redditLogin = () => {
    const clientId = "Lk6um7BwdOhBaGQ2S1KoGQ";
    const redirectUri = "http://localhost:5173/auth/reddit/callback";
    const scope = "identity history read";
    const state = crypto.randomUUID(); // Prevent CSRF attacks

    const authUrl = `https://www.reddit.com/api/v1/authorize?client_id=${clientId}&response_type=code&state=${state}&redirect_uri=${redirectUri}&duration=permanent&scope=${scope}`;

    window.location.href = authUrl;
  };

  const githubLogin = () => {
    const clientId = "Ov23lig3VR6qIJEj8i7D";
    const redirectUri = "http://localhost:5173/auth/github/callback";
    const state = crypto.randomUUID();

    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=read:user&state=${state}`;
    window.location.href = githubAuthUrl;
  };

  return (
    <div className="flex flex-col items-start gap-4 mt-6">
      <button
        onClick={redditLogin}
        className="border rounded px-4 py-2 text-white bg-orange-600"
      >
        Login with Reddit
      </button>

      <button
        onClick={githubLogin}
        className="border rounded px-4 py-2 text-white bg-gray-800"
      >
        Login with GitHub
      </button>
    </div>
  );
}
