import axios from "axios";

export const loginUser = async (data: { username: string, password: string }): Promise<void> => {
    try {
      console.log(data)
      const response = await axios.post('/api/login', data);
      if (response.status === 200) {
        //window.location.href = '/orbits';
      } else {
        throw new Error('Ошибка при аутентификации');
      }
    } catch (error) {
      throw new Error('Ошибка при аутентификации');
    }
  };
  
  