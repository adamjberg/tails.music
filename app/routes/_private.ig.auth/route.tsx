import { redirect } from "@remix-run/node";

export const loader = () => {
  const params = {
    enable_fb_login: "0",
    force_authentication: "1",
    client_id: process.env.IG_APP_ID,
    redirect_uri: `${process.env.BASE_URL}/ig/auth/callback`,
    response_type: "code",
    scope:
      "instagram_business_basic,instagram_basic,instagram_manage_insights,pages_read_engagement,pages_show_list",
  } as any;

  const instagramAuthUrl = new URL("https://api.instagram.com/oauth/authorize");
  const searchParams = new URLSearchParams(params);

  instagramAuthUrl.search = searchParams.toString();

  return redirect(instagramAuthUrl.toString());
};
