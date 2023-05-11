import { faAnglesLeft, faAnglesRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion, useScroll } from "framer-motion";
import { useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import styled from "styled-components";
import {
  getMovies,
  getpopularMovies,
  IGetMoviesResult,
  IGetPopularMovies,
} from "../api";
import { makeImagePath } from "../utils";
import useWindowDimensions from "../windowDimension";

const Wrapper = styled.div`
  background: black;
  overflow-x: hidden;
  padding-bottom: 200px;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled.div<{ bgphoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.8)),
    url(${(props) => props.bgphoto});
  background-size: cover;
`;

const Title = styled.h2`
  font-size: 68px;
  margin-bottom: 30px;
`;

const Overview = styled.p`
  font-size: 24px;
  width: 50%;
`;

const Slider = styled.div`
  position: relative;
  top: -100px;
`;

const PopularSlider = styled.div`
  position: relative;
  top: +200px;
`;

const Row = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 5px;
  left: 0;
  right: 0;
  margin: 0 auto;
  position: absolute;
  width: 90%;
`;

const Box = styled(motion.div)<{ bgphoto: string }>`
  background-color: white;
  background-image: url(${(props) => props.bgphoto});
  background-size: cover;
  background-position: center center;
  height: 200px;
  cursor: pointer;
  &:first-child {
    transform-origin: center left;
  }
  &:nth-child(6) {
    transform-origin: center right;
  }
`;

const offset = 6;

const boxVars = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
    y: -50,
    transition: { delay: 0.5, duration: 0.3, type: "tween" },
  },
};

const BoxInfo = styled(motion.div)`
  padding: 10px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: -40px;
  h4 {
    text-align: center;
    font-size: 18px;
  }
`;

const infoVars = {
  hover: {
    opacity: 1,
    transition: { delay: 0.5, duration: 0.3, type: "tween" },
  },
};

const BigMovieInfo = styled(motion.div)<{ ypoint: number }>`
  position: absolute;
  width: 40vw;
  height: 80vh;
  top: ${(props) => props.ypoint + 150}px;
  left: 0;
  right: 50px;
  margin: 0 auto;
  background-color: ${(props) => props.theme.black.lighter};
  border-radius: 15px;
  overflow: hidden;
  z-index: 5;
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  opacity: 0;
  z-index: 4;
`;

const BigCover = styled.div`
  width: 100%;
  background-size: cover;
  background-position: center center;
  height: 400px;
`;

const BigTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  font-size: 38px;
  position: relative;
  padding: 10px;
  top: -70px;
`;

const BigOVerview = styled.p`
  position: relative;
  padding: 20px;
  top: -70px;
  color: ${(props) => props.theme.white.lighter};
`;

const BoxName = styled.h2`
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
`;

function Home() {
  const history = useHistory();
  const bigMovieMatch = useRouteMatch<{ movieId: string }>("/movies/:movieId");
  const bigPopMovieMatch = useRouteMatch<{ popmovieId: string }>(
    `/popularmovies/:popmovieId`
  );
  const { scrollY } = useScroll();
  const { data, isLoading } = useQuery<IGetMoviesResult>(
    ["movies", "nowPlaying"],
    getMovies
  );
  const { data: popularData } = useQuery<IGetPopularMovies>(
    ["movies", "popular"],
    getpopularMovies
  );
  const [index, setIndex] = useState(0);
  const [popularIndex, setPopularIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [indexBack, setIndexBack] = useState(false);

  const increaseIndex = () => {
    if (data) {
      if (leaving) return;
      toggleLeaving();
      setIndexBack(false);
      const totalMovies = data.results.length - 1;
      const maxIndex = Math.ceil(totalMovies / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const decreaseIndex = () => {
    if (data) {
      if (leaving) return;
      toggleLeaving();
      setIndexBack(true);
      const totalMovies = data.results.length - 1;
      const maxIndex = Math.ceil(totalMovies / offset) - 1;
      setIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
    }
  };

  const increasePopularIndex = () => {
    if (popularData) {
      if (leaving) return;
      toggleLeaving();
      setIndexBack(false);
      const totalMovies = popularData.results.length;
      const maxIndex = Math.ceil(totalMovies / offset) - 1;
      setPopularIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const decreasePopularIndex = () => {
    if (popularData) {
      if (leaving) return;
      toggleLeaving();
      setIndexBack(true);
      const totalMovies = popularData.results.length;
      const maxIndex = Math.ceil(totalMovies / offset) - 1;
      setPopularIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
    }
  };

  const toggleLeaving = () => {
    setLeaving((PREV) => !PREV);
  };

  const rowVars = {
    start: (indexBack: boolean) => {
      return {
        x: indexBack ? -width - 10 : width + 10,
      };
    },
    exit: (indexBack: boolean) => {
      return {
        x: indexBack ? width + 10 : -width - 10,
        opacity: indexBack ? 0 : 1,
      };
    },
  };

  const width = useWindowDimensions();
  const onBoxClicked = (movieId: number) => {
    history.push(`/movies/${movieId}`);
  };

  const onPopBoxClicked = (popmovieId: number) => {
    history.push(`/popularmovies/${popmovieId}`);
  };

  const onOverlayClick = () => {
    history.push("/");
  };

  const clickedMovie =
    bigMovieMatch?.params.movieId &&
    data?.results.find((movie) => movie.id === +bigMovieMatch.params.movieId);
  const clickedPopularMovie =
    bigPopMovieMatch?.params.popmovieId &&
    popularData?.results.find(
      (popularMovie) => +bigPopMovieMatch.params.popmovieId === popularMovie.id
    );
  console.log(clickedMovie, clickedPopularMovie);

  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner bgphoto={makeImagePath(data?.results[0].backdrop_path || "")}>
            <Title>{data?.results[0].title}</Title>
            <Overview>{data?.results[0].overview}</Overview>
          </Banner>
          <Slider>
            <BoxName>Now Playing</BoxName>
            <IndexNextButton onClick={increaseIndex}>
              <FontAwesomeIcon icon={faAnglesRight} />
            </IndexNextButton>
            <IndexPrevButton onClick={decreaseIndex}>
              <FontAwesomeIcon icon={faAnglesLeft} />
            </IndexPrevButton>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              <Row
                variants={rowVars}
                initial="start"
                animate={{ x: 0 }}
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
                key={index}
                custom={indexBack}
              >
                {data?.results
                  .slice(1)
                  .slice(offset * index, offset * index + offset)
                  .map((movie) => (
                    <Box
                      layoutId={movie.id + ""}
                      key={movie.id}
                      variants={boxVars}
                      initial="normal"
                      onClick={() => onBoxClicked(movie.id)}
                      whileHover="hover"
                      transition={{ type: "tween" }}
                      bgphoto={makeImagePath(movie.backdrop_path, "w500")}
                    >
                      <BoxInfo variants={infoVars}>
                        <h4>{movie.title}</h4>
                      </BoxInfo>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
          </Slider>
          <PopularSlider>
            <BoxName>Popular Movies</BoxName>
            <IndexNextButton onClick={increasePopularIndex}>
              <FontAwesomeIcon icon={faAnglesRight} />
            </IndexNextButton>
            <IndexPrevButton onClick={decreasePopularIndex}>
              <FontAwesomeIcon icon={faAnglesLeft} />
            </IndexPrevButton>

            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              <Row
                variants={rowVars}
                initial="start"
                animate={{ x: 0 }}
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
                key={popularIndex}
              >
                {popularData?.results
                  .slice(offset * popularIndex, offset * popularIndex + offset)
                  .map((popularMovie) => (
                    <Box
                      layoutId={popularMovie.id + "pop"}
                      key={popularMovie.id}
                      variants={boxVars}
                      initial="normal"
                      onClick={() => onPopBoxClicked(popularMovie.id)}
                      whileHover="hover"
                      transition={{ type: "tween" }}
                      bgphoto={makeImagePath(
                        popularMovie.backdrop_path,
                        "w500"
                      )}
                    >
                      <BoxInfo variants={infoVars}>
                        <h4>{popularMovie.title}</h4>
                      </BoxInfo>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
          </PopularSlider>
          <AnimatePresence>
            {bigMovieMatch ? (
              <>
                <Overlay
                  onClick={onOverlayClick}
                  animate={{ opacity: 1, transition: { duration: 0.5 } }}
                  exit={{ opacity: 0, transition: { duration: 0.5 } }}
                />
                <BigMovieInfo
                  layoutId={bigMovieMatch.params.movieId + ""}
                  ypoint={scrollY.get()}
                >
                  {clickedMovie && (
                    <>
                      <BigCover
                        style={{
                          backgroundImage: `linear-gradient(to top,rgba(0,0,0,0.7),transparent),url(${makeImagePath(
                            clickedMovie.backdrop_path,
                            "w500"
                          )})`,
                        }}
                      />
                      <BigTitle>{clickedMovie.title}</BigTitle>
                      <BigOVerview>{clickedMovie.overview}</BigOVerview>
                    </>
                  )}
                </BigMovieInfo>
              </>
            ) : bigPopMovieMatch ? (
              <>
                <Overlay
                  onClick={onOverlayClick}
                  animate={{ opacity: 1, transition: { duration: 0.5 } }}
                  exit={{ opacity: 0, transition: { duration: 0.5 } }}
                />
                <BigMovieInfo
                  layoutId={bigPopMovieMatch.params.popmovieId + "pop"}
                  ypoint={scrollY.get()}
                >
                  {clickedPopularMovie && (
                    <>
                      <BigCover
                        style={{
                          backgroundImage: `linear-gradient(to top,rgba(0,0,0,0.7),transparent),url(${makeImagePath(
                            clickedPopularMovie.backdrop_path,
                            "w500"
                          )})`,
                        }}
                      />
                      <BigTitle>{clickedPopularMovie.title}</BigTitle>
                      <BigOVerview>{clickedPopularMovie.overview}</BigOVerview>
                    </>
                  )}
                </BigMovieInfo>
              </>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}

export default Home;
