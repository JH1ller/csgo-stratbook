import * as prismic from "@prismicio/client"
import * as prismicH from '@prismicio/helpers';
import { PrismicRichText } from '@prismicio/react';

const repositoryName = 'stratbook';

export async function ImprintPageComponent() {
  const client = prismic.createClient(repositoryName, { fetch, accessToken: process.env.PRISMIC_TOKEN });
  const imprint = await client.getByType('imprint');

  const data = imprint.results[0].data;

  return (
    <main className="w-full py-12 md:py-24 lg:py-32 px-12 md:px-24 flex flex-col gap-6 container">
      <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">{prismicH.asText(data.title)}</h1>
      <PrismicRichText field={data.content} components={{
        heading5: ({ children }) => <h5 className="text-lg font-bold tracking-tighter">{children}</h5>,
      }} />
    </main>
  )
}