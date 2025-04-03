// _app.js
import { useRouter } from 'next/router'
import Script from 'next/script'
import './global.css'
import './global_dmg.css'

function MyApp({ Component, pageProps }) {
  const router = useRouter()
  const path = router.pathname

  const shouldLoadAnimations = !['/UploadImages', '/DmgAssist'].includes(path)

  return (
    <>
      <a href="#" className="scrollup" id="scroll-up">
        <i className="ri-arrow-up-line"></i>
      </a>

      {shouldLoadAnimations && (
        <>
          <Script src="/cardiag/js/scrollreveal.min.js" strategy="afterInteractive" />
          <Script
            src="/cardiag/js/swiper-bundle.min.js"
            strategy="afterInteractive"
            onLoad={() => {
              const s = document.createElement('script')
              s.src = '/cardiag/js/main.js'
              document.body.appendChild(s)
            }}
          />
          <Script src="/cardiag/js/mixitup.min.js" strategy="afterInteractive" />
        </>
      )}

      <Component {...pageProps} />
    </>
  );
}

export default MyApp


