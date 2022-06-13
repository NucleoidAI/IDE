import Settings from "../settings";
import service from "../service";
import { useLayoutContext } from "../Context/providers/layoutContextProvider";

function useLayout() {
  const [state, dispatch] = useLayoutContext();

  const defaultMetric = {
    total: 100,
    free: 50,
  };

  const getStatus = () => {
    service
      .metrics()
      .then((values) => {
        Settings.connection = true;
        dispatch({
          type: "SET_STATUS",
          payload: {
            metrics: values,
            status: "connected",
          },
        });
      })
      .catch((err) => {
        Settings.connection = false;
        dispatch({
          type: "SET_STATUS",
          payload: {
            metrics: defaultMetric,
            status: "unreachable",
          },
        });
      });
  };

  return [state, dispatch, getStatus];
}

export default useLayout;
