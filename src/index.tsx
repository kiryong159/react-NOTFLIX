import ReactDOM from "react-dom/client";
import { RecoilRoot } from "recoil";
import { ThemeProvider } from "styled-components";
import App from "./App";
import { darkTheme } from "./theme";
import { createGlobalStyle } from "styled-components";
import HelmetComponent from "./helmet";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const GlobalCss = createGlobalStyle`
body{
  font-family: "Nunito", sans-serif;
  line-height: 1.2;
  color:${(props) => props.theme.white.darker};
  height:150vh;
  background-color:black;
}
a {
  text-decoration-line: none;
color:inherit;
}
* {
  box-sizing: border-box;
}
`;

const client = new QueryClient();

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <RecoilRoot>
    <QueryClientProvider client={client}>
      <ThemeProvider theme={darkTheme}>
        <HelmetComponent />
        <GlobalCss />
        <App />
      </ThemeProvider>
    </QueryClientProvider>
  </RecoilRoot>
);
