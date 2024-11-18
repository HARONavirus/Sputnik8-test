import express from 'express';
import axios from 'axios';
const app = express();
const port = 3000;
const API_KEY = '873fa71c061b0c36d9ad7e47ec3635d9';
const USERNAME = 'frontend@sputnik8.com';

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173'); 
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

const fetchData = async (url, params) => {
  try {
    const response = await axios.get(url, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error.response ? error.response.data : error);
    const errorMessage = error.response ? error.response.data.error || error.response.statusText : 'Network Error';
    return { error: errorMessage };
  }
};

app.get('/api/cities', async (req, res) => {
  const data = await fetchData(`https://api.sputnik8.com/v1/cities?api_key=${API_KEY}&username=${USERNAME}`);
  res.json(data);
});

app.get('/api/products', async (req, res) => {
  const page = req.query.page; // Получаем параметр page из запроса
  if (!page) {
    return res.status(400).json({ error: 'Missing page parameter' }); // Обработка отсутствующего параметра
  }
  const data = await fetchData(`https://api.sputnik8.com/v1/products?api_key=${API_KEY}&username=${USERNAME}`, { page });
  res.json(data);
});

app.listen(port, () => {
  console.log(`Proxy server listening on port ${port}`);
});