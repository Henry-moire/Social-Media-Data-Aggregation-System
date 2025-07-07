import type { LoaderFunctionArgs } from "react-router";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  if (!code) {
    return new Response(JSON.stringify({ error: "Missing code" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const clientId = "Ov23lig3VR6qIJEj8i7D";
  const clientSecret = "bb3994be5cc0d20a7a4aa2ef52d5a17be56b6646";

  const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code,
    }),
  });

  const tokenData = await tokenRes.json();
  if (tokenData.error) {
    console.error("GitHub token error:", tokenData);
    return new Response(JSON.stringify({ error: tokenData.error }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const userRes = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${tokenData.access_token}`,
      Accept: "application/json",
    },
  });

  const userData = await userRes.json();
  console.log("GitHub user:", userData);

  // Optionally save to Supabase here

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>GitHub Profile</title>
        <style>
          body {
            font-family: sans-serif;
            background: #0d1117;
            color: white;
            padding: 2rem;
          }
          .card {
            background: #161b22;
            padding: 1.5rem;
            border-radius: 0.5rem;
          }
          img {
            border-radius: 50%;
            width: 80px;
            height: 80px;
            margin-bottom: 1rem;
          }
        </style>
      </head>
      <body>
        <div class="card">
          <img src="${userData.avatar_url}" alt="GitHub Avatar" />
          <h2>${userData.name || userData.login}</h2>
          <p><strong>Username:</strong> ${userData.login}</p>
          <p><strong>Public Repos:</strong> ${userData.public_repos}</p>
          <p><strong>Followers:</strong> ${userData.followers}</p>
          <p><strong>GitHub URL:</strong> <a href="${userData.html_url}" target="_blank" style="color: #58a6ff">${userData.html_url}</a></p>
        </div>
      </body>
    </html>
  `;

  return new Response(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html",
    },
  });
}
