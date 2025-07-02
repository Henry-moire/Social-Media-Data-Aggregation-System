import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

// ✅ Required for React Router file-based routing
export const loader = () => null;

export const Component = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<string>("Starting Reddit OAuth...");

  useEffect(() => {
    const rawCode = searchParams.get("code");

    if (!rawCode) {
      setStatus("Missing authorization code. Redirecting...");
      setTimeout(() => navigate("/login"), 2000);
      return;
    }

    const code = rawCode;

    async function exchangeCodeForToken() {
      try {
        setStatus("Contacting Reddit...");

        const response = await fetch("https://www.reddit.com/api/v1/access_token", {
          method: "POST",
          headers: {
            Authorization: "Basic " + btoa("eOKPDGc0mPmPIyRsu0e44-toCDb_2g"), // replace these
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            grant_type: "authorization_code",
            code,
            redirect_uri: "http://localhost:5173/auth/reddit/callback",
          }),
        });

        const text = await response.text();
        console.log("Raw response from Reddit:", text);

        const tokenData = JSON.parse(text);

        if (tokenData.error) {
          console.error("OAuth error:", tokenData);
          setStatus("OAuth error: " + tokenData.error);
          return;
        }

        setStatus("Login successful! Redirecting...");
        setTimeout(() => navigate("/profile"), 2000);
      } catch (err) {
        console.error("Token request failed:", err);
        setStatus("Failed to reach Reddit. Try again.");
      }
    }

    exchangeCodeForToken();
  }, []);

  return (
    <div style={{ padding: "2rem", color: "#fff", background: "#1a1a1a", fontFamily: "sans-serif" }}>
      <h1>Reddit OAuth Login</h1>
      <p>{status}</p>
    </div>
  );
};
