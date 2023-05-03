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
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1), 0 10px 20px rgba(0, 0, 0, 0.06);
`;

const boxVars = {
  // hover: { scale: 1.0, rotateZ: 90 },
  // click: { scale: 1.0, rotateZ: 180, borderRadius: "100px" },
};

const boxVar = {
  initial: { opacity: 0, scale: 0 },
  visible: { opacity: 1, scale: 1, rotateZ: 360 },
  leaving: { opacity: 0, scale: 0, y: 20 },
};

function App() {
  const [showing, setShowing] = useState(false);
  const onClick = () => {
    setShowing((prev) => !prev);
  };
  return (
    <>
      <HelmetComponent />
      <GlobalCss />
      <Wrapper>
        <button onClick={onClick}>ddd</button>
        <AnimatePresence>
          {showing ? (
            <Box
              variants={boxVar}
              initial="initial"
              animate="visible"
              exit="leaving"
            />
          ) : null}
        </AnimatePresence>
      </Wrapper>
    </>
  );
}

export default App;
