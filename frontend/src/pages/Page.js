import { useLocation } from "react-router-dom";

const Page = () => {
  const location = useLocation();
  const { state } = location;

  // State'ten veriyi alın
  const id = state && state.id;

  return <div>{id}</div>;
};

export { Page };
