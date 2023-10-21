import Link from 'next/link'

const Error = () => {
  return (
    <div className="bg-[#1db44d11]">
      <div className="w-full h-[calc(100vh_-_356.47px)] flex flex-col sm:flex-row justify-center gap-8 sm:justify-around items-center px-5 max-w-[1400px] mx-auto">
        <div>
          <p className="font-black text-[44px] sm:text-[64px] md:text-[84px] text-[#384259]">
            Ooops....
          </p>

          <p className="font-bold text-[20px] md:text-[30px] text-[#858585]">
            Esta página no existe
          </p>

          <Link href="/">
            <a className="btn bg-primary-300 text-white">Volver al inicio</a>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Error
