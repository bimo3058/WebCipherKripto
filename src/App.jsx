import useMediaQuery from "@mui/material/useMediaQuery";
import AppDesktop from "./AppDesktop";
import AppMobile from "./AppMobile";

export default function App() {
  const isMobile = useMediaQuery("(max-width:768px)");
  return isMobile ? <AppMobile /> : <AppDesktop />;
}
