import React from 'react'
import Image from 'next/image';

const About = () => {
  return (
    <section className="about section" id="about">
      <div className="about__container container grid">
        <div className="about__group">
          <Image
            src="/cardiag/img/about.png"
            alt="About"
            className="about__img"
            width={500}
            height={300}
            priority // if it's important to show quickly
          />
          <div className="about__card">
            <h3 className="about__card-title" style={{display:'contents'}}>5,000+</h3>
            <p className="about__card-description">Claims processed successfully</p>
          </div>
        </div>
        <div className="about__data">
          {/* <h2 className="section__title about__title">Efficient and Reliable Claim Processing</h2> */}
          <p className="about__description">
            At ClaimTheia, we utilize advanced AI-driven technology to expedite claim processing, ensuring faster turnaround times and accurate assessments for a seamless experience.
          </p>
          <p className="about__description">
            With over 5,000 claims processed, we help you focus on what matters by handling your claim quickly and efficiently.
          </p>
          <a href="#" className="button">Learn More</a>
        </div>
      </div>
    </section>
  )
}

export default About
