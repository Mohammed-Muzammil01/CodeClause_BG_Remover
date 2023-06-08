import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import addImg from './addImg.webp';
import axios from 'axios';


function App() {
  const [userImg, setUserImg] = useState(addImg);
  const [bgRemoved, setBgRemoved] = useState();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const imageUrl = URL.createObjectURL(file);
    setUserImg(imageUrl);
    // console.log(imageUrl);
  };
  // apiKey: '9KZqcm75QEBdgCZeaVHcH7aC'

  const handleBGRemoval = async () => {
    try {
      const res = await fetch(userImg);
      const blob = await res.blob();
      const reader = new FileReader();
  
      reader.onloadend = async () => {
        const base64data = reader.result;
        const base64Image = base64data.split(',')[1];
  
        // console.log(userImg);
        const response = await axios.post(
          'https://api.remove.bg/v1.0/removebg',
          {
            image_file_b64: base64Image,
            size: 'auto',
          },
          {
            headers: {
              'X-Api-Key': '9KZqcm75QEBdgCZeaVHcH7aC',
            },
            responseType: 'arraybuffer',
          }
        );
  
        const imageBlob = new Blob([response.data], { type: 'image/png' });
        const newimageUrl = URL.createObjectURL(imageBlob);
        setBgRemoved(newimageUrl);
        // console.log('Background removed image:', newimageUrl, response.data);
        };
      reader.readAsDataURL(blob);
    } catch (error) {
      // console.error('Error:', error);
      alert('Background cannot be removed');
    }
  };
  
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = bgRemoved;
    link.download = 'removed.png';
    link.click();
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-warning bg-warning">
        <div className="container">
          <a className="navbar-brand" href="/">
            <h1>BG-Remover</h1>
          </a>
        </div>
      </nav>

      <div className="body-container-div">
        <div className='input-area' >
          <input type="file" accept="image/*" className='form-control' onChange={handleImageChange} />
          {bgRemoved ? <button className='btn btn-light' onClick={handleDownload}>Download</button> : ''}
          <img src={bgRemoved ? bgRemoved : userImg} alt='userImg' className='userImg' />
          <button className='btn btn-light' onClick={handleBGRemoval}>Remove Background</button>
        </div>
      </div>
    </>
  );
}

export default App;
