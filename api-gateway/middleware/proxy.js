const axios = require('axios');

const proxyRequest = async (method, path, data = null, headers = {}, baseUrl = process.env.BACKEND_URL) => {
  try {
    const targetUrl = `${baseUrl}${path}`;

    const config = {
      method,
      url: targetUrl,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    };

    if (data) {
      config.data = data;
    }

    const response = await axios(config);
    return {
      status: response.status,
      data: response.data,
      headers: response.headers,
    };
  } catch (error) {
    console.error(`Proxy error for ${method} ${path}:`, error.message);
    throw {
      status: error.response?.status || 502,
      message: error.response?.data?.message || 'Bad Gateway',
      error: error.message,
    };
  }
};

module.exports = { proxyRequest };
