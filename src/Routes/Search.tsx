import { useQuery } from "@tanstack/react-query";
import { useHistory, useLocation, useRouteMatch } from "react-router-dom";
import { getSearch, IGetSearch } from "../api";
import styled from "styled-components";
import { AnimatePresence, motion, useScroll } from "framer-motion";
import { makeImagePath } from "../utils";

const Wrapper = styled.div`
  height: 100vh;
  background: ${(props) => props.theme.black.darker};
  overflow-x: hidden;
  ::-webkit-scrollbar {
    display: none; /*크롬 엣지 */
  }
  -ms-overflow-style: none; /* 인터넷 익스플로러 */
  scrollbar-width: none; /* 파이어폭스 */
`;

const SearchKeyword = styled.h2`
  position: relative;
  left: 100px;
  top: 130px;
  font-size: 50px;
  font-weight: bold;
`;

const SearchBox = styled.div`
  padding: 50px;
  padding-top: 200px;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 30px;
`;

const SmallBox = styled(motion.div)<{ bgPhoto: string }>`
  position: relative;
  height: 200px;
  background-image: url(${(props) => props.bgPhoto});
  background-size: cover;
  background-position: center center;
  border-radius: 10px;
  cursor: pointer;
`;

/* const NoBgPhoto = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 30px;
  font-size: 25px;
  font-weight: bold;
  position: relative;
  top: 30px;
`;
 */
const smallBoxVars = {
  start: { scale: 1.0 },
  hover: { scale: 1.2, y: -70, transition: { delay: 0.5, duration: 0.5 } },
  exit: { scale: 1.0, transition: { duration: 0.5 } },
};

const SmallBoxTitleVars = {
  hover: {
    opacity: 1,
    transition: { delay: 0.5, duration: 0.3, type: "tween" },
  },
};
const SmallBoxTitle = styled(motion.div)`
  padding: 10px;
  position: absolute;
  bottom: -30px;
  width: 100%;
  opacity: 0;
  background-color: ${(props) => props.theme.black.lighter};
  h4 {
    text-align: center;
    font-size: 18px;
  }
`;

const SearchInfoBox = styled(motion.div)``;
const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100vw;
  height: 100vh;
  z-index: 5;
  background-color: rgba(0, 0, 0, 0.5);
`;
const SearchInfo = styled(motion.div)<{ ypoint: number }>`
  position: absolute;
  width: 40vw;
  height: 80vh;
  top: ${(props) => props.ypoint + 100}px;
  left: 0;
  right: 50px;
  margin: 0 auto;
  background-color: ${(props) => props.theme.black.lighter};
  border-radius: 15px;
  overflow-y: scroll;
  z-index: 5;
  ::-webkit-scrollbar {
    display: none; /*크롬 엣지 */
  }
  -ms-overflow-style: none; /* 인터넷 익스플로러 */
  scrollbar-width: none; /* 파이어폭스 */
`;
const SearchInfoImg = styled.div<{ bgPhoto: string }>`
  background-image: linear-gradient(to top, rgba(0, 0, 0, 1), transparent),
    url(${(props) => props.bgPhoto});
  width: 100%;
  background-size: cover;
  background-position: center center;
  height: 400px;
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

const SearchInfoTitle = styled.h2`
  color: ${(props) => props.theme.white.lighter};
  font-size: 50px;
  font-weight: bold;
  position: relative;
  padding: 10px;
  top: -100px;
`;
const SearchInfoOverview = styled.p`
  position: relative;
  padding: 20px;
  top: -70px;
  font-size: 20px;
  color: ${(props) => props.theme.white.lighter};
`;

function Search() {
  const history = useHistory();
  const location = useLocation();
  const keyword = new URLSearchParams(location.search).get("keyword");

  const { data: searchData } = useQuery<IGetSearch>(
    ["search", `${keyword}`],
    () => getSearch(keyword + "")
  );
  const onBoxClick = (searchId: number) => {
    history.push(`/search/${searchId}?keyword=${keyword}`);
  };
  const onOverRayClick = () => {
    history.push(`/search/?keyword=${keyword}`);
  };
  const searchMatch = useRouteMatch<{ searchId: string }>(`/search/:searchId`);
  /* search뒤의 ?부분은 안적어도 되는듯? */
  const SearchMovieData =
    searchMatch &&
    searchData?.results.find(
      (data) => +searchMatch.params.searchId === data.id
    );
  const { scrollY } = useScroll();
  return (
    <>
      <Wrapper>
        <SearchKeyword>Search : {keyword}</SearchKeyword>
        <SearchBox>
          <AnimatePresence>
            {searchData?.results.map((search) => (
              <SmallBox
                layoutId={search.id + ""}
                variants={smallBoxVars}
                whileHover="hover"
                initial="start"
                exit="exit"
                key={search.id}
                onClick={() => onBoxClick(search.id)}
                bgPhoto={
                  search.backdrop_path
                    ? makeImagePath(search.backdrop_path, "w200")
                    : search.poster_path
                    ? makeImagePath(search.poster_path, "w200")
                    : "https://www.shoshinsha-design.com/wp-content/uploads/2020/05/noimage-760x460.png"
                }
              >
                {/* <NoBgPhoto>
                  {search.poster_path
                    ? null
                    : search.backdrop_path
                    ? null
                    : search.title}
                </NoBgPhoto> */}
                <SmallBoxTitle variants={SmallBoxTitleVars}>
                  <h4>{search.title}</h4>
                </SmallBoxTitle>
              </SmallBox>
            ))}
          </AnimatePresence>
        </SearchBox>
        <AnimatePresence>
          {SearchMovieData ? (
            <SearchInfoBox>
              <Overlay onClick={onOverRayClick} />
              <SearchInfo
                layoutId={SearchMovieData.id + ""}
                ypoint={scrollY.get()}
              >
                <SearchInfoImg
                  bgPhoto={
                    SearchMovieData.backdrop_path
                      ? makeImagePath(SearchMovieData.backdrop_path, "w500")
                      : makeImagePath(SearchMovieData.poster_path, "w500")
                  }
                />
                <SearchInfoTitle>
                  {SearchMovieData.title.length < 30
                    ? SearchMovieData.title
                    : SearchMovieData.title.slice(0, 26) + "..."}
                </SearchInfoTitle>
                <SearchInfoOverview>
                  {SearchMovieData.overview === ""
                    ? "Overview is not registered."
                    : SearchMovieData.overview}
                </SearchInfoOverview>
                <MoreInfo>
                  <span>
                    ⭐ : {Math.round(SearchMovieData.vote_average * 10) / 10} (
                    {SearchMovieData.vote_count})
                  </span>
                  <span>
                    Popularity : {Math.floor(SearchMovieData.popularity)}
                  </span>
                  <span>Release Date : {SearchMovieData.release_date}</span>
                </MoreInfo>
              </SearchInfo>
            </SearchInfoBox>
          ) : null}
        </AnimatePresence>
      </Wrapper>
    </>
  );
}

export default Search;
