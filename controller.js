const axios = require('axios');
const xml2js = require('xml2js');

const parser = new xml2js.Parser({ explicitArray: false });

const getWeatherData = async (city) => {
  const url = 'https://weatherapi-com.p.rapidapi.com/current.json';
  const headers = {
    'X-RapidAPI-Key': 'YOUR_KEY',
    'X-RapidAPI-Host': 'weatherapi-com.p.rapidapi.com',
  };

  try {
    const response = await axios.get(url, { headers, params: { q: city } });

    if (response.status === 200) {
      return response.data;
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
};

const formatResponse = (data, outputFormat) => {
  if (outputFormat === 'json') {
    return {
      Weather: `${data.current.temp_c} C`,
      Latitude: data.location.lat.toString(),
      Longitude: data.location.lon.toString(),
      City: `${data.location.name} ${data.location.country}`,
    };
  } else if (outputFormat === 'xml') {
    const xmlObject = {
      root: {
        Temperature: data.current.temp_c.toString(),
        City: data.location.name,
        Latitude: data.location.lat.toString(),
        Longitude: data.location.lon.toString(),
      },
    };

    return new xml2js.Builder().buildObject(xmlObject);
  } else {
    return { error: 'Invalid output_format. Use "json" or "xml".' };
  }
};

const getCurrentWeather = async (req, res) => {
  try {
    const { city, output_format: outputFormat } = req.body;
    const weatherData = await getWeatherData(city);

    if (weatherData) {
      const formattedResponse = formatResponse(weatherData, outputFormat);
      res.json(formattedResponse);
    } else {
      res.json({ error: 'Error retrieving weather data.' });
    }
  } catch (error) {
    res.json({ error: error.toString() });
  }
};

module.exports = {
  getCurrentWeather,
};
