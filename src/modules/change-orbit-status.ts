export const changeOrbitStatus = async (orbit_name: string): Promise<void> => {
    try {
      const response = await fetch(`api/orbits/change_status/${orbit_name}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.status === 200) {
      } else {
        throw new Error('Ошибка при изменении статуса орбиты');
      }
    } catch (error) {
      throw new Error('Ошибка при изменении статуса орбиты');
    }
  };
  