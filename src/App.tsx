import styled, { createGlobalStyle } from "styled-components";
import HelmetComponent from "./helmet";

const GlobalCss = createGlobalStyle`
body{
  font-family: "Nunito", sans-serif;
  background:linear-gradient(135deg,#e09,#d0e);
  line-height: 1.2;
  color:black
}
a {
  text-decoration-line: none;
color:inherit;
}
* {
  box-sizing: border-box;
}
`;

const Wrapper = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Box = styled.div`
  width: 200px;
  height: 200px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1), 0 10px 20px rgba(0, 0, 0, 0.06);
`;

function App() {
  return (
    <>
      <HelmetComponent />
      <GlobalCss />
      <Wrapper>
        <Box />
      </Wrapper>
    </>
  );
}

export default App;
