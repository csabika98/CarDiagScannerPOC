import React from 'react'
import Head from 'next/head'
import Script from 'next/script'
import Navbar from '../components/navbar'
import Hero from '../components/hero'
import About from '../components/about'
import Footer from '../components/footer'


export async function getServerSideProps() {
  try {
    const res = await fetch('http://127.0.0.1:5001/cardiag/backend/api/cars');
    console.log('FETCH STATUS:', res.status);
    
    const cars = await res.json();
    console.log('FETCHED CARS:', cars);
    
    return {
      props: {
        initialCars: cars,
        revalidate: 3600,
        initialMakes: [...new Set(cars.map(car => car.make))],
        error: null
      }
    };
  } catch (error) {
    console.error('Error fetching cars:', error.message);
    return { props: { initialCars: [], initialMakes: [], error: error.message } };
  }
}


const Home = ({ initialCars, initialMakes, error }) => {
  return (
    <>
      <Head>
        <title>ClaimTheia - Loss Identification</title>
      </Head>

      <Navbar />
      <Hero initialCars={initialCars} initialMakes={initialMakes} error={error} />
      <About />
      <Footer />
      <Script src="https://unpkg.com/scrollreveal" strategy="lazyOnload" onLoad={() => {
        const sr = ScrollReveal({
          origin: 'top',
          distance: '60px',
          duration: 2500,
          delay: 400,
        });

        sr.reveal(`.home__title, .home__subtitle, .home__button`, { delay: 500 });
        sr.reveal(`.about__title, .about__description`, { delay: 600 });
        sr.reveal(`.popular__container`, { delay: 700 });  }} />
    </> 
  );
}

export default Home;




