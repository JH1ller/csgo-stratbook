import * as prismic from '@prismicio/client';
import * as prismicH from '@prismicio/helpers';

export type NoticeDto = {
  id: string;
  title: string;
  tags: string[];
  version: string;
  content: string;
  expires: string;
  image?: string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const toNoticeDto = (notice: prismic.PrismicDocument<Record<string, any>, string, string>) => ({
  id: notice.id,
  title: prismicH.asText(notice.data.title),
  version: notice.tags[0],
  tags: notice.tags.slice(1),
  content: prismicH.asHTML(notice.data.description),
  expires: prismicH.asDate(notice.data.expires),
  image: prismicH.asImageSrc(notice.data.image),
});
