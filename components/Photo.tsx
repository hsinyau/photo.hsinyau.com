import cn from "classnames";
import ColorHash from "color-hash";
import { basename } from "$std/path/basename.ts";

import { ImageMedium } from "vsco-api";

import { useEnv } from "../islands/EnvContext.tsx";
import ShareButton from "../islands/ShareButton.tsx";
import OpenButton from "../islands/OpenButton.tsx";
import PaginationButton from "../islands/PaginationButton.tsx";
import CloseButton from "../islands/CloseButton.tsx";

export interface ImageProps {
  image: ImageMedium["image"];
  next?: string;
  previous?: string;
  matches?: boolean;
}

const colorHash = new ColorHash({
  lightness: [0.85, 0.95],    // 提高亮度范围（原默认值 [0.35, 0.65]）
  saturation: [0.2, 0.4],     // 降低饱和度范围（原默认值 [0.35, 1]）
  hue: { min: 0, max: 360 }   // 保持全色相范围
});

export default function Photo({ matches, image, previous, next }: ImageProps) {
  // check slug
  const slug = image._id;
  const id = `id-${slug}`;
  const imageUrl = imageLink(image, 300);

  let srcSet, sizes;

  // if (matches) {
  //   srcSet = `${imageUrl} 300w, ${imageLink(image, 600)} 600w, ${
  //     imageLink(image, 800)
  //   } 800w, ${imageLink(image, 800)} 1000w`;
  //   sizes = `100vw`;
  // } else {
  srcSet = `${imageUrl} 300w, ${imageLink(image, 600)} 600w, ${
    imageLink(image, 800)
  } 800w`;
  sizes =
    `(min-width: 300px) 100vw, (min-width: 440px) 50vw, (min-width: 640px) 33vw, 25vw`;
  // }

  const capture_date = new Date(image.capture_date_ms);

  const tint = colorHash.hex(slug);

  const env = useEnv();

  return (
    <li
      className={cn("item", { target: matches })}
      id={id}
      key={slug}
      title={image.description}
      style={{ backgroundColor: tint }}
    >
      <img
        loading="lazy"
        srcSet={srcSet}
        sizes={sizes}
        src={imageUrl}
        width={image.width}
        height={image.height}
      />
      <span className="full">
        <span
          style={{
            backgroundImage: `url(${imageLink(image, 1280)})`,
          }}
        />
      </span>,
      <OpenButton id={id} href={slug} />
      <CloseButton />
      <PaginationButton
        className="previous"
        slug={previous}
        title="Go to previous photo"
        label="Previous"
      />{" "}
      <PaginationButton
        className="next"
        slug={next}
        title="Go to next photo"
        label="Next"
      />
      <ul className="links top photodetail-links">
        {image.description
          ? (
            <li className="caption">
              <span className="caption-text">{image.description}</span>
            </li>
          )
          : null}
        <li className="date">
          <code>
            <time dateTime={capture_date.toISOString()}>
              {capture_date.toLocaleDateString("en-IE")}
            </time>
          </code>
        </li>
        {env.ALLOW_IMAGE_SHARING == "1" && (
          <ShareButton
            text={image.description}
            slug={slug}
          />
        )}
        {env.ALLOW_ORIGINAL_DOWNLOAD == "1" && (
          <li class="download">
            <a
              href={imageUrl}
              download={imageName(image)}
              class=""
              title="Download this image"
            >
              Download
            </a>
          </li>
        )}
      </ul>

      <ul className="meta">
        {env.ALLOW_IMAGE_SHARING == "1" && (
          <ShareButton
            text={image.description}
            slug={slug}
            className="gridview-button share"
          />
        )}
        {env.ALLOW_ORIGINAL_DOWNLOAD == "1" && (
          <li class="download">
            <a
              href={imageUrl}
              download={imageName(image)}
              className="gridview-button download"
              title="Download this image"
            >
              Download
            </a>
          </li>
        )}
      </ul>
    </li>
  );
}

export function imageLink(image: ImageMedium["image"], width: number) {
  const url = new URL("https://" + image.responsive_url);
  url.searchParams.set("w", width.toString());

  return url.toString();
}

function imageName(image: ImageMedium["image"]) {
  return basename(image.responsive_url);
}
