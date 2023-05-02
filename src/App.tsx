import styled, { createGlobalStyle } from "styled-components";
import HelmetComponent from "./helmet";
import {
  motion,
  motionValue,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";

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
  height: 200vh;
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
  // hover: { scale: 1.0, rotateZ: 90 },
  // click: { scale: 1.0, rotateZ: 180, borderRadius: "100px" },
};

function App() {
  const x = motionValue(0);
  const rotateValue = useTransform(x, [-800, 800], [-360, 360]);
  const bgValue = useTransform(
    x,
    [-800, 0, 800],
    [
      "linear-gradient(-135deg, rgb(111, 0, 238), rgb(0, 210, 238))",
      "linear-gradient(0deg, rgb(238, 0, 153), rgb(221, 0, 238))",
      "linear-gradient(135deg, rgb(0, 238, 186), rgb(238, 234, 0))",
    ]
  );
  const { scrollYProgress } = useScroll();
  const scrollValue = useTransform(scrollYProgress, [0, 1], [1, 5]);
  return (
    <>
      <HelmetComponent />
      <GlobalCss />
      <Wrapper style={{ background: bgValue }}>
        <Box
          style={{ x, rotateZ: rotateValue, scale: scrollValue }}
          drag="x"
          dragSnapToOrigin
          variants={boxVars}
          whileHover="hover"
          whileTap="click"
        />
      </Wrapper>
    </>
  );
}

export default App;
