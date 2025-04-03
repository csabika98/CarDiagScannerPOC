import React, { useState } from 'react';
import Image from 'next/image';


const Hero = ({ initialCars = [], initialMakes = [], error }) => {
  const [cars] = useState(initialCars);
  const [makes] = useState(initialMakes);
  const [selectedMake, setSelectedMake] = useState('');
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  if (error) {
    return (
      <section className="home section" id="home">
        <div className="container">
          <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>
        </div>
      </section>
    );
  }


  const handleMakeChange = (event) => {
    const selectedMake = event.target.value;
    setSelectedMake(selectedMake);
    setErrorMessage(''); 

    const filteredModels = cars
      .filter((car) => car.make === selectedMake)
      .map((car) => car.model);
    setModels(filteredModels);

    sessionStorage.setItem('selectedMake', selectedMake);
  };

  const handleModelChange = (event) => {
    const selectedModel = event.target.value;
    setSelectedModel(selectedModel);
    setErrorMessage(''); 

    sessionStorage.setItem('selectedModel', selectedModel);
  };

  const handleStartClick = () => {
    if (!selectedMake || !selectedModel) {
      setErrorMessage('Please select a car make and model to proceed.');
    } else {
      window.location.href = '/cardiag/UploadImages';
    }
  };

  return (
    <section className="home section" id="home">
      
      <div className="shape shape__big"></div>
      <div className="shape shape__small"></div>
      <div className="home__container container grid">
      
        <div className="home__data">
          <h1 className="home__title" style={{ display: 'block', top: '50px', left: '440px' }}>ClaimTheia - Loss Identification</h1>
          <br />
          <h2 className="home__title" style={{ display: 'contents' }}>Automatic Damage Detection</h2>
          <br />
          <h3 className="home__subtitle" style={{ display: 'contents' }}>Image Recognition with AI</h3>
          <br />
          <h4 className="home__subtitle" style={{ display: 'contents' }}>Faster Claim Processing</h4>
          <br />
          <h5 className="home__elec" style={{ display: 'contents' }}>
            <i className="ri-flashlight-fill"></i> Try it out! 
          </h5> 
        </div>
        <Image
          src="/cardiag/img/home.png"
          alt="Home"
          className="home__img"
          width={500}
          height={300}
          priority // if it's important to show quickly
        />
        <label htmlFor="car-select" style={{ width: '150px', justifySelf: 'center' }}>
          Choose a car:
        </label>

        <select
          id="car-make"
          style={{ width: '150px', justifySelf: 'center' }}
          onChange={handleMakeChange}
        >
          <option value="">Select a make</option>
          {makes.map((make, index) => (
            <option key={index} value={make}>
              {make}
            </option>
          ))}
        </select>

        <select
          id="car-model"
          style={{ width: '150px', justifySelf: 'center' }}
          onChange={handleModelChange}
          disabled={!selectedMake}
        >
          <option value="">Select a model</option>
          {models.map((model, index) => (
            <option key={index} value={model}>
              {model}
            </option>
          ))}
        </select>

        <button
          className="home__button"
          onClick={handleStartClick}
        >
          START
        </button>

        {errorMessage && <p style={{ color: 'red', textAlign: 'center' }}>{errorMessage}</p>}
      </div>
    </section>
  );
};

export default Hero;




