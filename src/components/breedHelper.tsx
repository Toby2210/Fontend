import React, { useState, useEffect } from "react";
import axios from "axios";
import { message, Row, Col, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const BreedHelper = () => {
  const [breeds, setBreeds] = useState([]);
  const [breedImages, setBreedImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isReloading, setIsReloading] = useState(false);

  useEffect(() => {
    const fetchBreeds = async () => {
      try {
        const response = await axios.get("https://dog.ceo/api/breeds/list/all");
        const breedsData = response.data.message;
        const breedsList = Object.keys(breedsData);
        setBreeds(breedsList);
      } catch (error) {
        console.error("Error fetching breeds:", error);
      }
    };

    fetchBreeds();
  }, []);

  useEffect(() => {
    if (breeds.length === 0) {
      return;
    }

    const fetchBreedImages = async () => {
      try {
        setIsLoading(true);

        const breedImagesData = await Promise.all(
          breeds.map(async (breed) => {
            const response = await axios.get(`https://dog.ceo/api/breed/${breed}/images/random`);
            return {
              breed,
              image: response.data.message
            };
          })
        );

        setBreedImages(breedImagesData);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching breed images:", error);
      }
    };

    fetchBreedImages();
  }, [breeds]);
  // copy button
  const handleCopyBreed = (selectedBreed) => {
    navigator.clipboard.writeText(selectedBreed)
      .then(() => {
        message.success('Copied to clipboard!');
      })
      .catch((error) => {
        message.error('Failed to copy to clipboard.');
        console.error('Error:', error);
      });
  };
  // reload image button
  const handleReloadImage = async (breed) => {
    try {
      const response = await axios.get(`https://dog.ceo/api/breed/${breed}/images/random`);
      const updatedBreedImages = breedImages.map(item => {
        if (item.breed === breed) {
          return {
            breed: item.breed,
            image: response.data.message
          };
        }
        return item;
      });
      setBreedImages(updatedBreedImages);
    } catch (error) {
      console.error("Error reloading image:", error);
    }
  };

  return (
    <div>
      <h3>Welcome to Dog Breed Selection</h3>
      {isLoading ? (
        <div style={{ textAlign: "center", marginTop: "16px" }}>
          <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
        </div>
      ) : (
        <Row gutter={[16, 16]}>
          {breedImages.map(({ breed, image }) => (
            <Col key={breed} xs={24} sm={12} md={8} lg={6} xl={4}>
              <div style={{ textAlign: "center" }}>
                <img src={image} alt={breed} style={{ width: "100%", height: "auto", marginBottom: "8px" }} />
                <div>{breed}</div>
                <button onClick={() => handleCopyBreed(breed)}>Copy Breed</button>
                <button onClick={() => handleReloadImage(breed)}>New Image</button>
              </div>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default BreedHelper;