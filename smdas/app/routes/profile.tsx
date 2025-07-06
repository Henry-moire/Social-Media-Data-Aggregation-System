import React from "react";

export default function RedditLogin() {
  const redditLogin = () => {
    const clientId = "Lk6um7BwdOhBaGQ2S1KoGQ";
    const redirectUri = "http://localhost:5173/auth/reddit/callback";
    const scope = "identity history read";
    const state = crypto.randomUUID(); // Prevent CSRF attacks

    const authUrl = `https://www.reddit.com/api/v1/authorize?client_id=${clientId}&response_type=code&state=${state}&redirect_uri=${redirectUri}&duration=permanent&scope=${scope}`;

    window.location.href = authUrl; // Redirect to Reddit OAuth page
  };

  return (
    <button
      onClick={redditLogin}
      className="border rounded px-4 py-2 mt-4 text-white bg-orange-600"
    >
      Login with Reddit
    </button>
  );
}
