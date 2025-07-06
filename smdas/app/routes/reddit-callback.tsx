import { useEffect, useState } from "react";
import { supabase } from "~/supabase-client";

export default function Reddit() {
  const [status, setStatus] = useState("Waiting for Reddit response...");
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState<any[]>([]);


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
        await supabase.from("RedditStats").insert([{
          user_id: userData.id, // or use your own internal user ID
          total_karma: userData.total_karma,
          link_karma: userData.link_karma,
          comment_karma: userData.comment_karma,
        }]);
        const { data, error } = await supabase
          .from("RedditStats")
          .select("*")
          .eq("user_id", userData.id)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching stats:", error);
          setStatus("Error fetching stored stats.");
        } else {
          setStats(data);
        }

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
      {stats.length > 0 && (
        <div style={{ marginTop: "2rem" }}>
          <h2>Reddit Karma History</h2>
          <table style={{ width: "100%", color: "white", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ borderBottom: "1px solid white" }}>Date</th>
                <th style={{ borderBottom: "1px solid white" }}>Total Karma</th>
                <th style={{ borderBottom: "1px solid white" }}>Link Karma</th>
                <th style={{ borderBottom: "1px solid white" }}>Comment Karma</th>
              </tr>
            </thead>
            <tbody>
              {stats.map((entry, index) => (
                <tr key={index}>
                  <td>{new Date(entry.created_at).toLocaleString()}</td>
                  <td>{entry.total_karma}</td>
                  <td>{entry.link_karma}</td>
                  <td>{entry.comment_karma}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}
