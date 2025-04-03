import { useEffect } from 'react'

const Featured = () => {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Dynamically import mixitup only on the client side
      import('mixitup').then((mixitup) => {
        const containerEl = document.querySelector('.featured__content')

        if (containerEl) {
          mixitup(containerEl, {
            selectors: {
              target: '.featured__card',
            },
            animation: {
              duration: 300,
            },
          })
        }
      }).catch((error) => console.error('MixItUp import error:', error))
    }
  }, [])

  return (
    <section className="featured section" id="featured">
      <h2 className="section__title">Featured Luxury Cars</h2>

      <div className="featured__container container">
        <ul className="featured__filters">
          <li>
            <button className="featured__item active-featured" data-filter="all">
              <span>All</span>
            </button>
          </li>
          <li>
            <button className="featured__item" data-filter=".tesla">
              <img src="/cardiag/assets/img/logo3.png" alt="" />
            </button>
          </li>
          <li>
            <button className="featured__item" data-filter=".audi">
              <img src="/cardiag/assets/img/logo2.png" alt="" />
            </button>
          </li>
          <li>
            <button className="featured__item" data-filter=".porsche">
              <img src="/cardiag/assets/img/logo1.png" alt="" />
            </button>
          </li>
        </ul>

        <div className="featured__content grid">
          <article className="featured__card mix tesla">
            <h1 className="featured__title">Tesla</h1>
            <h3 className="featured__subtitle">Model X</h3>
            <img src="/cardiag/assets/img/featured1.png" alt="" className="featured__img" />
            <h3 className="featured__price">$98,900</h3>
            <button className="button featured__button">
              <i className="ri-shopping-bag-2-line"></i>
            </button>
          </article>

          {/* Add more cards here */}
        </div>
      </div>
    </section>
  )
}

export default Featured

