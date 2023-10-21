import NextHead from 'next/head'

interface Props {
  title?: string
  link?: string
  description?: string
  domain?: string
  image?: string
  keywords?: string
  url?: string
}

export const Seo = (data: Props) => {
  return (
    <NextHead>
      <title>{data.title}</title>
      <meta property="og:locale" content="es_ES" />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={data.title || ''} />
      <meta property="og:description" content={data.description || ''} />
      <meta property="og:url" content={data.url || ''} />
      <meta property="og:site_name" content={data.title || ''} />
      <meta name="keywords" content={data.keywords || ''} />

      {/* Para facebook, SMS */}
      <meta property="og:image" content={data.image || ''} />
      <meta property="og:image:width" content="300" />
      <meta property="og:image:height" content="300" />
      <meta property="og:image:alt" content={data.description || ''} />

      {/* Para twitter  */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:description" content={data.description || ''} />
      <meta name="twitter:title" content={data.title || ''} />
      <meta name="twitter:image" content={data.image || ''} />
    </NextHead>
  )
}
