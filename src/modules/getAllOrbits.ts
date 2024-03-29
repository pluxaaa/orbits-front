import axios from 'axios';
import { Orbit } from './ds';

export const getAllOrbits = async (orbitName = '', orbitIncl = '', orbitIsCircle = '', userToken = ''): Promise<{ allOrbits: Orbit[], reqID: number }> => {
  if (userToken === "") {
    userToken = "guest";
  }

  const config = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + userToken,
      'Accept': 'application/json'
    },
  };

  try {
    const queryParams = new URLSearchParams({
      orbit_name: orbitName,
      orbit_incl: orbitIncl,
      is_circle: orbitIsCircle,
    });

    const response = await axios.get(`/api/orbits?${queryParams.toString()}`, config);
    
    const { allOrbits, reqID } = response.data;

    return { allOrbits, reqID };
  } catch (error) {
    console.error('Error fetching orbits:', error);
    return {
      allOrbits: orbitsData,
      reqID: 0,
    };
  }
};

export const orbitsData = [
  {
      ID: 1,
      Name: 'Геостационарная орбита',
      IsAvailable: true,
      Apogee: '35786',
      Perigee: '35786',
      Inclination: '0',
      Description: 'Геостационарная орбита (ГСО) на высоте 35 786 км над экватором обеспечивает идеальное положение для спутников, так как они "замерзают" в небе, следуя угловой скорости вращения Земли. Это делает их стабильными точками для размещения коммуникационных и телетрансляционных спутников, предоставляя постоянное и неподвижное соединение. Идея использования таких орбит возникла десятилетия назад, и сегодня геостационарные спутники являются неотъемлемой частью мировой инфраструктуры связи, обеспечивая широкий доступ к глобальным коммуникациям.',
      ImageURL: '../GEO.png'
  },
  {
      ID: 2,
      Name: 'Низкая околоземная орбита',
      IsAvailable: true,
      Apogee: '1000',
      Perigee: '1000',
      Inclination: '0',
      Description: 'Низкая околоземная орбита (НОО) охватывает диапазон высот от 160 км до 2000 км над поверхностью Земли, обеспечивая краткие периоды обращения в пределах 88 до 127 минут. Эта орбита является предпочтительным местом для космических миссий и обитаемых космических станций. Здесь осуществляются как пилотируемые полеты, включая программу Аполлон, так и многочисленные миссии искусственных спутников. Важно отметить, что объекты, находящиеся на высотах менее 160 км, подвергаются сильному воздействию атмосферы и нестабильны.',
      ImageURL: '../LEO.png'
  },
  {
    ID: 6,
    Name: 'Молния',
    IsAvailable: true,
    Apogee: '12',
    Perigee: '21',
    Inclination: '63.4',
    Description: 'Орбита "Молния" представляет собой высокоэллиптическую траекторию с наклонением в 63,4°, аргументом перицентра −90° и периодом обращения в половину звёздных суток. Названная в честь советских космических аппаратов "Молния", этот тип орбиты обеспечивает длительное пребывание спутника у апогея, проходящего над северным полушарием. Спутник становится особенно видимым в северном полушарии, включая территории России и Канады, благодаря высоте апогея, достигающей 40 тысяч километров. Эта особенность использовалась для создания сети ретрансляционных узлов "Орбита", обеспечивающей покрытие всей территории СССР. Для полного охвата северного полушария требовалось не менее трех космических аппаратов, и на практике использовались четыре пары спутников "Молния", смещенных на 90° относительно друг друга.',
    ImageURL: '../Molniya.png'
  }]
