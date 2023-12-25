import axios from 'axios';

export const uploadOrbitImage = async (
  userToken: string | undefined,
  imageFile: File,
  orbitName: string | undefined)
  : Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('orbitName', orbitName || "");

    const response = await axios.post<string>(`/api/orbits/upload_image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${userToken}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Ошибка при загрузке изображения:', error);
    throw error;
  }
};
