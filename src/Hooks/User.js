import { useDispatch, useSelector } from "react-redux";
import { setUser as setUserAction } from "../Redux/User";

export const useUser = () => {
  const dispatch = useDispatch();

  const user = useSelector((x) => x.userReducer.user);
  const setUser = (user) => {
    dispatch(setUserAction(user));
  };

  return {
    user,
    setUser,
  };
};
