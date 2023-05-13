import { faAnglesLeft, faAnglesRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion, useScroll } from "framer-motion";
import { useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import styled from "styled-components";
import { getPopularTv, getTodayTv, IGetPopularTv, IGetTodayTv } from "../api";
import { makeImagePath } from "../utils";
import useWindowDimensions from "../windowDimension";

const Wrapper = styled.div`
  height: 100vh;
  width: 100%;
  overflow-x: hidden;
  background-color: ${(props) => props.theme.black.veryDark};
  ::-webkit-scrollbar {
    display: none; /*크롬 엣지 */
  }
  -ms-overflow-style: none; /* 인터넷 익스플로러 */
  scrollbar-width: none; /* 파이어폭스 */
`;

const MainBanner = styled.div<{ bgphoto: string }>`
  background-image: linear-gradient(to top, rgba(0, 0, 0, 0.9), transparent),
    url(${(props) => props.bgphoto});
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100vh;
  padding: 60px;
  background-size: cover;
  background-position: center center;
`;
const BannerTitle = styled.h1`
  font-size: 68px;
  margin-bottom: 30px;
`;

const BannerOverview = styled.p`
  font-size: 30px;
  width: 50%;
`;

const Slider = styled.div`
  position: relative;
  top: -150px;
`;

const Row = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  gap: 10px;
  width: 90%;
  left: 0;
  right: 0;
  margin: 0 auto;
  padding-bottom: 100px;
`;

const Box = styled(motion.div)<{ bgphoto: string }>`
  background-image: url(${(props) => props.bgphoto});
  background-position: center center;
  background-size: cover;
  height: 200px;
  cursor: pointer;
`;

const SliderName = styled.h2`
  font-size: 29px;
  position: relative;
  font-weight: bold;
  top: -25px;
  left: 125px;
`;

const IndexNextButton = styled.button`
  position: absolute;
  top: 100px;
  right: 30px;
  background-color: transparent;
  color: ${(props) => props.theme.white.lighter};
  border: none;
  font-size: 30px;
  z-index: 3;
  cursor: pointer;
`;
const IndexPrevButton = styled.button`
  position: absolute;
  top: 100px;
  left: 30px;
  background-color: transparent;
  color: ${(props) => props.theme.white.lighter};
  border: none;
  font-size: 30px;
  z-index: 3;
  cursor: pointer;
`;

const BoxTitle = styled(motion.div)`
  width: 100%;
  background-color: ${(props) => props.theme.black.darker};
  position: relative;
  bottom: -180px;
  padding: 10px;
  opacity: 0;
  text-align: center;
  h4 {
    font-size: 17px;
    font-weight: bold;
  }
`;

const Overlay = styled(motion.div)`
  background-color: rgba(0, 0, 0, 0.6);
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  z-index: 4;
`;
const BigTvInfo = styled(motion.div)<{ ypoint: number }>`
  width: 40vw;
  height: 80vh;
  position: absolute;
  left: 0;
  right: 0;
  margin: 0 auto;
  top: ${(props) => props.ypoint + 120}px;
  border-radius: 15px;
  background-color: ${(props) => props.theme.black.lighter};
`;

function Tv() {
  const hisetory = useHistory();
  const { scrollY } = useScroll();
  const [index, setIndex] = useState(0);
  const [indexincreasing, setIndexincreasing] = useState(false);
  const { data: tvTodayData, isLoading } = useQuery<IGetTodayTv>(
    ["Tv", "Today"],
    getTodayTv
  );
  const { data: tvPopularData } = useQuery<IGetPopularTv>(
    ["Tv", "Popular"],
    getPopularTv
  );

  const increaseIndex = () => {
    if (tvPopularData) {
      if (indexincreasing) return;
      toggleState();
      const indexLength = tvPopularData.results.length - 1;
      const maxIndex = Math.ceil(indexLength / offset - 1);
      setIndex((prev) => (maxIndex === prev ? 0 : prev + 1));
    }
  };
  const decreaseIndex = () => {
    if (tvPopularData) {
      if (indexincreasing) return;
      toggleState();
      const indexLength = tvPopularData.results.length - 1;
      const maxIndex = Math.ceil(indexLength / offset - 1);
      setIndex((prev) => (0 === prev ? maxIndex : prev - 1));
    }
  };

  const toggleState = () => {
    setIndexincreasing((prev) => !prev);
  };

  const width = useWindowDimensions();
  const offset = 6;
  const rowVars = {
    hidden: {
      x: width + 10,
    },
    visible: {
      x: 0,
    },
    exit: {
      x: -width - 10,
    },
  };
  const boxVars = {
    normal: { scale: 1.0 },
    hover: { y: -50, scale: 1.3, transition: { delay: 0.5, duration: 0.5 } },
  };
  const boxTitleVars = {
    hover: {
      opacity: 1,
      transition: { delay: 0.5, duration: 0.5 },
    },
  };

  const onOverlayClick = () => {
    hisetory.push(`/tv`);
  };

  const onTvBoxClicked = (tvId: number) => {
    hisetory.push(`/tv/${tvId}`);
  };
  const popularTvMatch = useRouteMatch<{ tvId: string }>(`/tv/:tvId`);
  const findPopularTvInfo =
    popularTvMatch?.params.tvId &&
    tvPopularData?.results.find((tv) => tv.id === +popularTvMatch?.params.tvId);

  return (
    <Wrapper>
      {isLoading ? (
        "Loading ... "
      ) : (
        <>
          <MainBanner
            bgphoto={
              tvPopularData?.results[0].backdrop_path
                ? makeImagePath(tvPopularData?.results[0].backdrop_path + "")
                : makeImagePath(tvPopularData?.results[0].poster_path + "")
            }
          >
            <BannerTitle>{tvPopularData?.results[0].name}</BannerTitle>
            <BannerOverview>
              {tvPopularData?.results[0].overview === ""
                ? "Overview is not registered."
                : tvPopularData?.results[0].overview}
            </BannerOverview>
          </MainBanner>
          <Slider>
            <SliderName>Popular Tv show</SliderName>
            <IndexNextButton onClick={increaseIndex}>
              <FontAwesomeIcon icon={faAnglesRight} />
            </IndexNextButton>
            <IndexPrevButton onClick={decreaseIndex}>
              <FontAwesomeIcon icon={faAnglesLeft} />
            </IndexPrevButton>
            <AnimatePresence initial={false} onExitComplete={toggleState}>
              <Row
                variants={rowVars}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
                key={index}
              >
                {tvPopularData?.results
                  .slice(1)
                  .slice(index * offset, index * offset + offset)
                  .map((tvPopData) => (
                    <Box
                      key={tvPopData.id}
                      variants={boxVars}
                      bgphoto={
                        tvPopData.backdrop_path
                          ? makeImagePath(tvPopData.backdrop_path + "")
                          : makeImagePath(tvPopData.poster_path + "")
                      }
                      onClick={() => onTvBoxClicked(tvPopData.id)}
                      initial="normal"
                      whileHover="hover"
                    >
                      <BoxTitle variants={boxTitleVars}>
                        <h4>{tvPopData.name}</h4>
                      </BoxTitle>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
          </Slider>
          <AnimatePresence>
            {findPopularTvInfo ? (
              <>
                <Overlay onClick={onOverlayClick} />
                <BigTvInfo ypoint={scrollY.get()}></BigTvInfo>
              </>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}

export default Tv;
