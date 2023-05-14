const API_KEY = "31581fb70bfe123b6cab23244fcf0d8a";
const BASE_PATH = "https://api.themoviedb.org/3";
const BASE_TV_PATH = "https://api.themoviedb.org/3";

interface IMovie {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
  popularity: number;
  release_date: string;
  vote_average: number;
  vote_count: number;
}

export interface IGetMoviesResult {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}

export function getMovies() {
  return fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

export interface IGetPopularMovies {
  results: IMovie[];
}

export function getpopularMovies() {
  return fetch(
    `${BASE_PATH}/movie/popular?api_key=${API_KEY}&language=en-US&page=1`
  ).then((response) => response.json());
}

export interface IGetTopMovies {
  results: IMovie[];
}

export function getTopMovies() {
  return fetch(
    `${BASE_PATH}/movie/top_rated?api_key=${API_KEY}&language=en-US&page=1`
  ).then((response) => response.json());
}

export interface IGetSearch {
  results: IMovie[];
}

export function getSearch(KeyWord: string) {
  return fetch(
    `${BASE_PATH}/search/movie?api_key=${API_KEY}&language=en-US&query=${KeyWord}&page=1&include_adult=false`
  ).then((response) => response.json());
}

interface ITv {
  id: number;
  backdrop_path: string;
  poster_path: string;
  name: string;
  overview: string;
  popularity: number;
  first_air_date: string;
  vote_average: number;
  vote_count: number;
}

export interface IGetTv {
  results: ITv[];
}

export const getTodayTv = () => {
  return fetch(
    `${BASE_TV_PATH}/tv/airing_today?api_key=${API_KEY}&language=en-US&page=1`
  ).then((response) => response.json());
};

export const getPopularTv = () => {
  return fetch(
    `${BASE_TV_PATH}/tv/popular?api_key=${API_KEY}&language=en-US&page=1`
  ).then((response) => response.json());
};

export const getTopTv = () => {
  return fetch(
    `${BASE_TV_PATH}/tv/top_rated?api_key=${API_KEY}&language=en-US&page=1`
  ).then((response) => response.json());
};
