import { useRouter } from 'next/router';
import React from 'react';
import Head from 'next/head';
import Navbar from '../components/navbar';
import Footer from '../components/footer';
//import Index from '../pages/index';


const Results = () => {
  const router = useRouter();
  const { make, model, year, original_image_url, modified_image_url, damages } = router.query;

  const parsedDamages = damages ? JSON.parse(damages) : [];
  return (
    <>
    <Navbar
          logoSrc="/cardiag/photo-1551150441-649e0b074fe4-1500h.jpeg"
          rootClassName="navbarroot-class-name"
          link2="Features"
          link3="Pricing"
          logoAlt="ClaimTheia"
        ></Navbar>
      <div className="results-container">
        <Head>
          <title>Car Damage Result</title>
        </Head>

        {/* Main Results Section */}
        <div className="container results-content">
          <h1 className="text-center mt-5">Car Damage Result</h1>

          {/* Loss Analysis Section */}
          <div className="loss-analysis card">
            <h2>Loss Analysis</h2>
            <table className="table">
              <thead>
                <tr>
                  <th>{make} {model} {year}</th>
                 
                </tr>
              </thead>
              <tbody>
              
              </tbody>
            </table>
          </div>

          {/* Damage Details Section */}
          <div className="damage-details card">
            <h2>Identified Damages</h2>
            <div className="row">
              <div className="col-md-6">
                <img
                  src={`https://sallai.tech/cardiag/backend${modified_image_url}`}
                  alt="modified Image"
                  className="img-fluid damage-image"
                />
              </div>
              <div className="col-md-6">
                {parsedDamages.map((damage, index) => (
                  <div className="damage-item" key={index}>
                    <h4>Damage: {damage.part}</h4>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <Footer logoSrc="/cardiag/photo-1551150441-649e0b074fe4-1500h.jpeg"></Footer>

        {/* Styling for the results page */}
        <style jsx>{`
          .results-container {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background-color: #f5f5f5;
          }

          .results-content {
            background-color: #fff;
            padding: 40px;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            max-width: 900px;
            margin: 20px;
          }

          .loss-analysis, .damage-details {
            margin-top: 30px;
            padding: 20px;
            background-color: #fbe5d6;
            border-radius: 10px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }

          .table {
            width: 100%;
            margin: 0;
          }

          .damage-item {
            margin-bottom: 15px;
            background-color: #f7f7f7;
            padding: 10px;
            border-radius: 8px;
          }

          .damage-image {
            border-radius: 10px;
            margin-bottom: 20px;
            width: 100%;
            object-fit: cover;
          }

          h1, h2 {
            text-align: center;
            margin-bottom: 20px;
          }

          @media (max-width: 768px) {
            .results-content {
              padding: 20px;
            }

            .col-md-6 {
              width: 100%;
              margin-bottom: 20px;
            }
          }
        `}</style>
      </div>
    </>
  );
};

export default Results;

