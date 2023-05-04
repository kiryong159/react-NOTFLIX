import styled, { createGlobalStyle } from "styled-components";
import HelmetComponent from "./helmet";
import {
  AnimatePresence,
  motion,
  motionValue,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import { useState } from "react";

const GlobalCss = createGlobalStyle`
body{
  font-family: "Nunito", sans-serif;
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

const Wrapper = styled(motion.div)`
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: aliceblue;
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

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  width: 50vw;
  gap: 10px;
  div:first-child,
  div:last-child {
    grid-column: span 2;
  }
`;

const Box = styled(motion.div)`
  height: 200px;
  background-color: #9acae7;
  border-radius: 25px;
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1), 0 10px 20px rgba(0, 0, 0, 0.06);
`;

const Overlay = styled(motion.div)`
  width: 100%;
  height: 100%;
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
`;

function App() {
  const [clicked, setClicked] = useState(false);
  const toggle = () => {
    setClicked((prev) => !prev);
  };
  return (
    <>
      <HelmetComponent />
      <GlobalCss />
      <Wrapper onClick={toggle}>
        <Grid>
          <Box layoutId="hello" />
          <Box />
          <Box />
          <Box />
        </Grid>
        <AnimatePresence>
          {clicked ? (
            <Overlay
              initial={{ backgroundColor: "rgba(0, 0, 0, 0.0)" }}
              animate={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
              exit={{ backgroundColor: "rgba(0, 0, 0, 0.0)" }}
            >
              <Box layoutId="hello" style={{ width: 400, height: 200 }} />
            </Overlay>
          ) : null}
        </AnimatePresence>
      </Wrapper>
    </>
  );
}

export default App;
