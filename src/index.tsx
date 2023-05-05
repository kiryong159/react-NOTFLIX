import ReactDOM from "react-dom/client";
import { RecoilRoot } from "recoil";
import { ThemeProvider } from "styled-components";
import App from "./App";
import { darkTheme } from "./theme";
import { createGlobalStyle } from "styled-components";
import HelmetComponent from "./helmet";

const GlobalCss = createGlobalStyle`
body{
  font-family: "Nunito", sans-serif;
  line-height: 1.2;
  color:black;
  height:150vh;
  background-color:aliceblue;
}
a {
  text-decoration-line: none;
color:inherit;
}
* {
  box-sizing: border-box;
}
`;

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <RecoilRoot>
    <ThemeProvider theme={darkTheme}>
      <HelmetComponent />
      <GlobalCss />
      <App />
    </ThemeProvider>
  </RecoilRoot>
);
