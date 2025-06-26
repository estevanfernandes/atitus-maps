import axios from 'axios';

const BASE_URL = 'https://outside-wilona-jgmotta2-02732f12.koyeb.app/ws/points';

export async function getPoints(token) {
  try {
    const response = await axios.get(BASE_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    

    const points = response.data.map(point => ({
      id: point.id,
      title: point.descricao,
      position: {
        lat: point.latitude,
        lng: point.longitude,
      },
    }));

    if (response.status === 200) {
      return points;
    } else {
      throw new Error('Erro ao buscar pontos');
    }
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Erro ao buscar pontos');
  }
}

export async function postPoint(token, pointData) {
  try {
    const response = await axios.post(BASE_URL, pointData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 201) {
      return response.data;
    } else {
      throw new Error('Erro ao cadastrar ponto');
    }
  } catch (error) {
    console.error('Erro ao cadastrar ponto:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Erro ao cadastrar ponto');
  }
}

