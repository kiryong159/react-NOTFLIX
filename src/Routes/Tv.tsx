import { faAnglesLeft, faAnglesRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion, useScroll } from "framer-motion";
import { useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import styled from "styled-components";
import { getPopularTv, getTodayTv, getTopTv, IGetTv } from "../api";
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
  top: 150px;
`;
const TodaySlider = styled.div`
  position: relative;
  top: +450px;
`;
const TopSlider = styled.div`
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
  z-index: 5;
`;

const BigTvInfoImg = styled.div<{ bgphoto: string }>`
  background-image: linear-gradient(to top, rgba(0, 0, 0, 0.9), transparent),
    url(${(props) => props.bgphoto});
  background-position: center center;
  background-size: cover;
  display: flex;
  height: 50%;
  width: 100%;
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
`;
const BigTvInfoTitle = styled.h1`
  font-size: 50px;
  font-weight: bold;
  position: relative;
  top: -100px;
  left: 20px;
`;
const BigTvInfoOverview = styled.div`
  position: relative;
  padding: 20px;
  top: -70px;
  color: ${(props) => props.theme.white.lighter};
`;

const MoreInfo = styled.div`
  display: flex;
  position: relative;
  top: -40px;
  flex-direction: column;
  margin-left: 15px;
  span {
    font-size: 20px;
    font-weight: bold;
    padding: 10px;
  }
`;

function Tv() {
  const hisetory = useHistory();
  const { scrollY } = useScroll();
  const [index, setIndex] = useState(0);
  const [todayIndex, setTodayIndex] = useState(0);
  const [topIndex, setTopIndex] = useState(0);
  const [indexincreasing, setIndexincreasing] = useState(false);
  const [indexBack, setIndexBack] = useState(false);
  const { data: tvTodayData } = useQuery<IGetTv>(["Tv", "Today"], getTodayTv);
  const { data: tvPopularData } = useQuery<IGetTv>(
    ["Tv", "Popular"],
    getPopularTv
  );
  const { data: tvTopData, isLoading } = useQuery<IGetTv>(
    ["Tv", "Top"],
    getTopTv
  );

  const increaseIndex = () => {
    if (tvPopularData) {
      if (indexincreasing) return;
      toggleState();
      setIndexBack(false);
      const indexLength = tvPopularData.results.length - 1;
      const maxIndex = Math.ceil(indexLength / offset - 1);
      setIndex((prev) => (maxIndex === prev ? 0 : prev + 1));
    }
  };
  const decreaseIndex = () => {
    if (tvPopularData) {
      if (indexincreasing) return;
      toggleState();
      setIndexBack(true);
      const indexLength = tvPopularData.results.length - 1;
      const maxIndex = Math.ceil(indexLength / offset - 1);
      setIndex((prev) => (0 === prev ? maxIndex : prev - 1));
    }
  };

  const increaseTodayIndex = () => {
    if (tvTodayData) {
      if (indexincreasing) return;
      toggleState();
      setIndexBack(false);
      const indexLength = tvTodayData.results.length;
      const maxIndex = Math.ceil(indexLength / offset - 1);
      setTodayIndex((prev) => (maxIndex === prev ? 0 : prev + 1));
    }
  };
  const decreaseTodayIndex = () => {
    if (tvTodayData) {
      if (indexincreasing) return;
      toggleState();
      setIndexBack(true);
      const indexLength = tvTodayData.results.length;
      const maxIndex = Math.ceil(indexLength / offset - 1);
      setTodayIndex((prev) => (0 === prev ? maxIndex : prev - 1));
    }
  };

  const increaseTopIndex = () => {
    if (tvTopData) {
      if (indexincreasing) return;
      toggleState();
      setIndexBack(false);
      const indexLength = tvTopData.results.length;
      const maxIndex = Math.ceil(indexLength / offset - 1);
      setTopIndex((prev) => (maxIndex === prev ? 0 : prev + 1));
    }
  };
  const decreaseTopIndex = () => {
    if (tvTopData) {
      if (indexincreasing) return;
      toggleState();
      setIndexBack(true);
      const indexLength = tvTopData.results.length;
      const maxIndex = Math.ceil(indexLength / offset - 1);
      setTopIndex((prev) => (0 === prev ? maxIndex : prev - 1));
    }
  };

  const toggleState = () => {
    setIndexincreasing((prev) => !prev);
  };

  const width = useWindowDimensions();
  const offset = 6;
  const rowVars = {
    hidden: (indexBack: boolean) => {
      return { x: indexBack ? -width - 10 : width + 10 };
    },
    visible: {
      x: 0,
    },
    exit: (indexBack: boolean) => {
      return {
        x: indexBack ? width + 10 : -width - 10,
        opacity: indexBack ? 0 : 1,
      };
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
    hisetory.push(`/tv/popular/${tvId}`);
  };
  const onTopTvBoxClicked = (topTvId: number) => {
    hisetory.push(`/tv/top/${topTvId}`);
  };

  const onTodayTvBoxClicked = (todayTvId: number) => {
    hisetory.push(`/tv/today/${todayTvId}`);
  };

  const popularTvMatch = useRouteMatch<{ tvId: string }>(`/tv/popular/:tvId`);
  const todayTvMatch = useRouteMatch<{ todayTvId: string }>(
    `/tv/today/:todayTvId`
  );
  const topTvMatch = useRouteMatch<{ topTvId: string }>(`/tv/top/:topTvId`);
  const findPopularTvInfo =
    popularTvMatch?.params.tvId &&
    tvPopularData?.results.find((tv) => tv.id === +popularTvMatch?.params.tvId);
  const findTodayTvInfo =
    todayTvMatch?.params.todayTvId &&
    tvTodayData?.results.find(
      (todayTv) => +todayTvMatch?.params.todayTvId === todayTv.id
    );
  const findTopTvInfo =
    topTvMatch?.params.topTvId &&
    tvTopData?.results.find(
      (topTv) => topTv.id === +topTvMatch?.params.topTvId
    );

  return (
    <Wrapper>
      {isLoading ? (
        "Loading ... "
      ) : (
        <>
          <MainBanner
            bgphoto={
              tvTopData?.results[0].backdrop_path
                ? makeImagePath(tvTopData?.results[0].backdrop_path + "")
                : makeImagePath(tvTopData?.results[0].poster_path + "")
            }
          >
            <BannerTitle>{tvTopData?.results[0].name}</BannerTitle>
            <BannerOverview>
              {tvTopData?.results[0].overview === ""
                ? "Overview is not registered."
                : tvTopData?.results[0].overview}
            </BannerOverview>
          </MainBanner>
          <TopSlider>
            <SliderName>TopRated Tv show</SliderName>
            <IndexNextButton onClick={increaseTopIndex}>
              <FontAwesomeIcon icon={faAnglesRight} />
            </IndexNextButton>
            <IndexPrevButton onClick={decreaseTopIndex}>
              <FontAwesomeIcon icon={faAnglesLeft} />
            </IndexPrevButton>
            <AnimatePresence initial={false} onExitComplete={toggleState}>
              <Row
                custom={indexBack}
                variants={rowVars}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
                key={topIndex}
              >
                {tvTopData?.results
                  .slice(1)
                  .slice(topIndex * offset, topIndex * offset + offset)
                  .map((tvTopData) => (
                    <Box
                      key={tvTopData.id}
                      layoutId={tvTopData.id + "Top"}
                      variants={boxVars}
                      bgphoto={
                        tvTopData.backdrop_path
                          ? makeImagePath(tvTopData.backdrop_path + "")
                          : makeImagePath(tvTopData.poster_path + "")
                      }
                      onClick={() => onTopTvBoxClicked(tvTopData.id)}
                      initial="normal"
                      whileHover="hover"
                    >
                      <BoxTitle variants={boxTitleVars}>
                        <h4>{tvTopData.name}</h4>
                      </BoxTitle>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
          </TopSlider>
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
                custom={indexBack}
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
                      layoutId={tvPopData.id + "Popular"}
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
          <TodaySlider>
            <SliderName>Today Tv show</SliderName>
            <IndexNextButton onClick={increaseTodayIndex}>
              <FontAwesomeIcon icon={faAnglesRight} />
            </IndexNextButton>
            <IndexPrevButton onClick={decreaseTodayIndex}>
              <FontAwesomeIcon icon={faAnglesLeft} />
            </IndexPrevButton>
            <AnimatePresence initial={false} onExitComplete={toggleState}>
              <Row
                custom={indexBack}
                variants={rowVars}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
                key={todayIndex}
              >
                {tvTodayData?.results
                  .slice(1)
                  .slice(todayIndex * offset, todayIndex * offset + offset)
                  .map((tvTodayData) => (
                    <Box
                      key={tvTodayData.id}
                      layoutId={tvTodayData.id + "Today"}
                      variants={boxVars}
                      bgphoto={
                        tvTodayData.backdrop_path
                          ? makeImagePath(tvTodayData.backdrop_path + "")
                          : makeImagePath(tvTodayData.poster_path + "")
                      }
                      onClick={() => onTodayTvBoxClicked(tvTodayData.id)}
                      initial="normal"
                      whileHover="hover"
                    >
                      <BoxTitle variants={boxTitleVars}>
                        <h4>{tvTodayData.name}</h4>
                      </BoxTitle>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
          </TodaySlider>
          <AnimatePresence>
            {findPopularTvInfo ? (
              <>
                <Overlay
                  onClick={onOverlayClick}
                  animate={{ opacity: 1, transition: { duration: 0.5 } }}
                  exit={{ opacity: 0, transition: { duration: 0.5 } }}
                />
                <BigTvInfo
                  layoutId={findPopularTvInfo.id + "Popular"}
                  ypoint={scrollY.get()}
                >
                  <BigTvInfoImg
                    bgphoto={
                      findPopularTvInfo.backdrop_path
                        ? makeImagePath(findPopularTvInfo.backdrop_path, "w500")
                        : makeImagePath(findPopularTvInfo.poster_path, "w500")
                    }
                  />
                  <BigTvInfoTitle>
                    {findPopularTvInfo.name.length < 30
                      ? findPopularTvInfo.name
                      : findPopularTvInfo.name.slice(0, 26) + "..."}
                  </BigTvInfoTitle>
                  <BigTvInfoOverview>
                    {findPopularTvInfo.overview}
                  </BigTvInfoOverview>
                  <MoreInfo>
                    <span>
                      ⭐ : {findPopularTvInfo.vote_average} (
                      {findPopularTvInfo.vote_count})
                    </span>
                    <span>
                      Popularity :{Math.floor(findPopularTvInfo.popularity)}
                    </span>
                    <span>
                      First Air Date : {findPopularTvInfo.first_air_date}
                    </span>
                  </MoreInfo>
                </BigTvInfo>
              </>
            ) : findTodayTvInfo ? (
              <>
                <Overlay
                  onClick={onOverlayClick}
                  animate={{ opacity: 1, transition: { duration: 0.5 } }}
                  exit={{ opacity: 0, transition: { duration: 0.5 } }}
                />
                <BigTvInfo
                  layoutId={findTodayTvInfo.id + "Today"}
                  ypoint={scrollY.get()}
                >
                  <BigTvInfoImg
                    bgphoto={
                      findTodayTvInfo.backdrop_path
                        ? makeImagePath(findTodayTvInfo.backdrop_path, "w500")
                        : makeImagePath(findTodayTvInfo.poster_path, "w500")
                    }
                  />
                  <BigTvInfoTitle>
                    {findTodayTvInfo.name.length < 30
                      ? findTodayTvInfo.name
                      : findTodayTvInfo.name.slice(0, 26) + "..."}
                  </BigTvInfoTitle>
                  <BigTvInfoOverview>
                    {findTodayTvInfo.overview}
                  </BigTvInfoOverview>
                  <MoreInfo>
                    <span>
                      ⭐ : {findTodayTvInfo.vote_average} (
                      {findTodayTvInfo.vote_count})
                    </span>
                    <span>
                      Popularity :{Math.floor(findTodayTvInfo.popularity)}
                    </span>
                    <span>
                      First Air Date : {findTodayTvInfo.first_air_date}
                    </span>
                  </MoreInfo>
                </BigTvInfo>
              </>
            ) : findTopTvInfo ? (
              <>
                <Overlay
                  onClick={onOverlayClick}
                  animate={{ opacity: 1, transition: { duration: 0.5 } }}
                  exit={{ opacity: 0, transition: { duration: 0.5 } }}
                />
                <BigTvInfo
                  layoutId={findTopTvInfo.id + "Top"}
                  ypoint={scrollY.get()}
                >
                  <BigTvInfoImg
                    bgphoto={
                      findTopTvInfo.backdrop_path
                        ? makeImagePath(findTopTvInfo.backdrop_path, "w500")
                        : makeImagePath(findTopTvInfo.poster_path, "w500")
                    }
                  />
                  <BigTvInfoTitle>
                    {findTopTvInfo.name.length < 30
                      ? findTopTvInfo.name
                      : findTopTvInfo.name.slice(0, 26) + "..."}
                  </BigTvInfoTitle>
                  <BigTvInfoOverview>
                    {findTopTvInfo.overview}
                  </BigTvInfoOverview>
                  <MoreInfo>
                    <span>
                      ⭐ : {findTopTvInfo.vote_average} (
                      {findTopTvInfo.vote_count})
                    </span>
                    <span>
                      Popularity :{Math.floor(findTopTvInfo.popularity)}
                    </span>
                    <span>First Air Date : {findTopTvInfo.first_air_date}</span>
                  </MoreInfo>
                </BigTvInfo>
              </>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}

export default Tv;
