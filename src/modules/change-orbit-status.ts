export const changeOrbitStatus = async (orbit_name: string): Promise<void> => {
    try {
      const response = await fetch(`api/orbits/change_status/${orbit_name}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log("chOrSt");
      if (response.status === 200) {
      } else {
        throw new Error('Ошибка при изменении статуса орбиты');
      }
    } catch (error) {
      throw new Error('Ошибка при изменении статуса орбиты');
    }
  };
  