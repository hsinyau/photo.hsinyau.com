import { Handlers, PageProps } from "$fresh/server.ts";
import { ImageMedium } from "vsco-api";

import { Photos } from "../components/Photos.tsx";
import { getAllMedia } from "../util/get-media.ts";
import { env } from "../util/env.ts";

export default function Grid({ url, data }: PageProps<GridData>) {
  let media = data.media
    .sort((a, b) => b.image.capture_date_ms - a.image.capture_date_ms);

  if (env.DEFAULT_REVERSE_SORT == "1") {
    media = media.reverse();
  }

  return (
    <main>
      <Photos images={media} url={url} />
    </main>
  );
}

export interface GridData {
  media: ImageMedium[];
}

export const handler: Handlers<GridData> = {
  async GET(_req, ctx) {
    const media = await getAllMedia();

    return ctx.render({ media });
  },
};
