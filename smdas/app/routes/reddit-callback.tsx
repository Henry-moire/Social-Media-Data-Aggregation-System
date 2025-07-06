import { useEffect, useState } from "react";

export default function Reddit() {
  const [status, setStatus] = useState("Waiting for Reddit response...");
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const run = async () => {
      // 👇 Only access location inside useEffect to avoid SSR errors
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");
      if (!code) {
        setStatus("Missing code.");
        return;
      }

      try {
        setStatus("Exchanging code for token...");

        const response = await fetch("https://www.reddit.com/api/v1/access_token", {
          method: "POST",
          headers: {
            Authorization: "Basic " + btoa("Lk6um7BwdOhBaGQ2S1KoGQ:eOKPDGc0mPmPIyRsu0e44-toCDb_2g"),
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            grant_type: "authorization_code",
            code,
            redirect_uri: "http://localhost:5173/auth/reddit/callback",
          }),
        });

        const tokenData = await response.json();
        console.log("Token response:", tokenData);

        if (tokenData.error) {
          setStatus("Token exchange failed: " + tokenData.error);
          return;
        }

        setStatus("Token received. Fetching Reddit profile...");

        const userRes = await fetch("https://oauth.reddit.com/api/v1/me", {
          headers: {
            Authorization: `bearer ${tokenData.access_token}`,
            "User-Agent": "your-app-name by u/yourusername",
          },
        });

        const userData = await userRes.json();
        console.log("Reddit user data:", userData);
        setProfile(userData);
        setStatus("Fetched profile successfully!");
      } catch (err) {
        console.error("Error:", err);
        setStatus("Something went wrong.");
      }
    };

    run();
  }, []);

  return (
    <div style={{ padding: "2rem", color: "white", background: "black" }}>
      <h1>Reddit OAuth Callback</h1>
      <p>{status}</p>
      {profile && (
        <div style={{ marginTop: "1rem" }}>
          <p><strong>Username:</strong> {profile.name}</p>
          <p><strong>Karma:</strong> {profile.total_karma}</p>
          <p><strong>Created:</strong> {new Date(profile.created_utc * 1000).toDateString()}</p>
        </div>
      )}
    </div>
  );
}
