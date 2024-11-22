import { json, LoaderFunction, redirect } from "@remix-run/node";

export const loader: LoaderFunction = async ({ request, context }) => {
  const url = new URL(request.url);
  const code = url.searchParams.get("code") as string;

  const accessTokenParams = new URLSearchParams({
    client_id: process.env.IG_APP_ID,
    client_secret: process.env.IG_SECRET,
    grant_type: "authorization_code",
    redirect_uri: `${process.env.BASE_URL}/ig/auth/callback`,
    code,
  } as any);

  try {
    const response = await fetch(
      `https://api.instagram.com/oauth/access_token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: accessTokenParams.toString(), // Convert params to query string
      }
    );

    if (!response.ok) {
      const jsonData = await response.json();
      throw new Error(jsonData.error_message || "Failed to fetch access token");
    }

    const data = await response.json();

    const shortLivedAccessToken = data.access_token;

    // Exchange short-lived token for long-lived token
    const longLivedTokenParams = new URLSearchParams({
      grant_type: "ig_exchange_token",
      client_secret: process.env.IG_SECRET,
      access_token: shortLivedAccessToken,
    } as any);

    const longLivedTokenResponse = await fetch(
      `https://graph.instagram.com/access_token?${longLivedTokenParams.toString()}`,
      {
        method: "GET",
      }
    );

    if (!longLivedTokenResponse.ok) {
      const errorData = await longLivedTokenResponse.json();
      throw new Error(
        errorData?.error?.message || "Failed to fetch long-lived access token"
      );
    }

    const longLivedTokenData = await longLivedTokenResponse.json();
    const longLivedAccessToken = longLivedTokenData.access_token;

    console.log(longLivedAccessToken);

    return {};
  } catch (error: any) {
    console.error(error);
    return json({ error: error.message }, { status: 500 });
  }
};
