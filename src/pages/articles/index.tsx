import type { GetServerSideProps } from 'next'

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return {
    redirect: {
      destination: '/',
      permanent: false
    }
  }
}

const ArticlesPage = () => {
  return <div className="flex-1">ArticlesPage</div>
}

export default ArticlesPage
