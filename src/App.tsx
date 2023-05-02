import styled, { createGlobalStyle } from "styled-components";
import HelmetComponent from "./helmet";
import { motion } from "framer-motion";
import { useRef } from "react";

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

const BigBox = styled.div`
  width: 600px;
  height: 600px;
  background-color: #bdc3c78d;
  border-radius: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`;

const Box = styled(motion.div)`
  width: 200px;
  height: 200px;
  background-color: #81a8c28d;
  border-radius: 25px;
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1), 0 10px 20px rgba(0, 0, 0, 0.06);
`;

const boxVars = {
  hover: { scale: 1.0, rotateZ: 90 },
  click: { scale: 1.0, borderRadius: "100px" },
};

function App() {
  const bigBoxRef = useRef<HTMLDivElement>(null);
  return (
    <>
      <HelmetComponent />
      <GlobalCss />
      <Wrapper>
        <BigBox ref={bigBoxRef}>
          <Box
            drag
            dragSnapToOrigin
            dragConstraints={bigBoxRef}
            variants={boxVars}
            whileHover="hover"
            whileTap="click"
          />
        </BigBox>
      </Wrapper>
    </>
  );
}

export default App;
