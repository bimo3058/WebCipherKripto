import useMediaQuery from "@mui/material/useMediaQuery";
import AppDesktop from "./Appdesktop";
import AppMobile from "./Appmobile";

export default function App() {
  const isMobile = useMediaQuery("(max-width:768px)");
  return isMobile ? <AppMobile /> : <AppDesktop />;
}
