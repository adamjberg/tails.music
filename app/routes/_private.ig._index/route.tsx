import { json } from "@remix-run/node";

export const loader = async () => {
  const accessToken = process.env.IG_ACCESS_TOKEN;

  // const response = await fetch(
  //   `https://graph.instagram.com/v20.0/me/media?access_token=${accessToken}&fields=id,caption,media_type,media_url,permalink,thumbnail_url,timestamp`
  // );
  // const data = await response.json();

  const response = await fetch(
    `https://graph.instagram.com/v20.0/18026907790797332/insights?metric=impressions,reach,saved&access_token=${accessToken}`
  );
  const data = await response.json();

  return json({
    data,
  });
};
