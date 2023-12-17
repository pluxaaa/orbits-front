import { getTransfReqs } from "./get-all-requests";
import { getRequestOrbits } from "./get-request-orbits";

const loadTransfReq = async (userToken: string | undefined, userRole: string | undefined, userName: string | undefined) => {
  if (userToken && userToken !== '') {
    const result = (await getTransfReqs(userToken, 'Черновик')).filter((item) => {
      if (userRole === '1') {
        return item.Client?.Name === userName;
      } else {
        return [];
      }
    });

    if (result[0]?.ID) {
      const orbitsData = await getRequestOrbits(result[0].ID, userToken);
      return orbitsData;
    }
  }

  return [];
}

export default loadTransfReq;
