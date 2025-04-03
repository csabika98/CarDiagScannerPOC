import { useState, useEffect } from 'react';
import Head from 'next/head';
import Navbar from '../components/navbar';
import Footer from '../components/footer';

const ClaimResponse = () => {
  const [claimData, setClaimData] = useState(null);

  useEffect(() => {
    const fetchClaimData = async () => {
      try {
        const response = await fetch('https://sallai.tech/cardiag/backend/api/process', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: "high"
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setClaimData(data);
        } else {
          console.error('Failed to fetch claim data:', response.status);
        }
      } catch (error) {
        console.error('Error fetching claim data:', error);
      }
    };

    fetchClaimData();
  }, []);

  return (
    <>
      <Navbar
        logoSrc="/cardiag/photo-1551150441-649e0b074fe4-1500h.jpeg"
        rootClassName="navbarroot-class-name"
        link2="Features"
        link3="Pricing"
        logoAlt="ClaimTheia"
      />
      <div className="results-container">
        <Head>
          <title>Claim Process Result</title>
        </Head>

        {/* Main Content Section */}
        <div className="container results-content">
          <h1 className="text-center mt-5">Claim Process Result</h1>

          {claimData ? (
            <div className="claim-details card">
              <h2>Claim Details</h2>
              <table className="table">
                <tbody>
                  <tr>
                    <td>Type</td>
                    <td>{claimData.type}</td>
                  </tr>
                  <tr>
                    <td>Risk Level</td>
                    <td>{claimData.riskLevel}</td>
                  </tr>
                  <tr>
                    <td>Message</td>
                    <td>{claimData.message}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          ) : (
            <p>Loading claim data...</p>
          )}
        </div>

        <Footer logoSrc="/cardiag/photo-1551150441-649e0b074fe4-1500h.jpeg"></Footer>

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

          .claim-details {
            margin-top: 30px;
            padding: 20px;
            background-color: #fbe5d6;
            border-radius: 10px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }

          .table {
            width: 100%;
          }

          h1, h2 {
            text-align: center;
            margin-bottom: 20px;
          }
        `}</style>
      </div>
    </>
  );
};

export default ClaimResponse;
