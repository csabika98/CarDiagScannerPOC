import { useEffect, useRef } from 'react'

const Popular = () => {
  const swiperRef = useRef(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Dynamically import Swiper on the client side
      import('swiper').then((Swiper) => {
        swiperRef.current = new Swiper.default('.swiper-container', {
          slidesPerView: 1,
          spaceBetween: 10,
          pagination: {
            el: '.swiper-pagination',
            clickable: true,
          },
          breakpoints: {
            640: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 3,
              spaceBetween: 40,
            },
            1024: {
              slidesPerView: 4,
              spaceBetween: 50,
            },
          },
        })
      }).catch((error) => console.error('Swiper import error:', error))
    }
  }, [])

  return (
    <section className="popular section" id="popular">
      <h2 className="section__title">
        Choose Your Electric Car <br /> Of The Porsche Brand
      </h2>
      <div className="popular__container container swiper-container">
        <div className="swiper-wrapper">
          <article className="popular__card swiper-slide">
            <h1 className="popular__title">Porsche</h1>
            <h3 className="popular__subtitle">Turbo S</h3>
            <img src="/cardiag/assets/img/popular1.png" alt="Porsche Turbo S" className="popular__img" />
            <div className="popular__data">
              <div className="popular__data-group"><i className="ri-dashboard-3-line"></i> 3.7 Sec</div>
              <div className="popular__data-group"><i className="ri-funds-box-line"></i> 356 Km/h</div>
              <div className="popular__data-group"><i className="ri-charging-pile-2-line"></i> Electric</div>
            </div>
            <h3 className="popular__price">$175,900</h3>
            <button className="button popular__button"><i className="ri-shopping-bag-2-line"></i></button>
          </article>

          {/* Add more cards here */}
        </div>
        <div className="swiper-pagination"></div>
      </div>
    </section>
  )
}

export default Popular


