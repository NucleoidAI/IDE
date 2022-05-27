import service from "../service";
import { useLayoutContext } from "../Context/providers/layoutContextProvider";

function useLayout() {
  const [state, dispatch] = useLayoutContext();

  const defaultMetric = {
    total: 100,
    free: 50,
  };

  const getStatus = () => {
    Promise.all([service.metrics(), service.openapi()])
      .then((values) => {
        dispatch({
          type: "SET_STATUS",
          payload: {
            metrics: values[0],
            status: "connected",
            openapi: values[1].started,
          },
        });
      })
      .catch((err) => {
        dispatch({
          type: "SET_STATUS",
          payload: {
            metrics: defaultMetric,
            status: "unreachable",
            openapi: false,
          },
        });
      });
  };

  return [state, dispatch, getStatus];
}

export default useLayout;
