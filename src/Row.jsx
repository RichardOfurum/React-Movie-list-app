import React, { useState, useEffect } from 'react';
import axios from './axios';
import { CircularProgress } from '@material-ui/core';
import "./Row.css";
import YouTube from 'react-youtube';
import movieTrailer from 'movie-trailer';

const base_url = "https://image.tmdb.org/t/p/original/";

const Row = ({title, fetchUrl, isLargeRow}) => {

    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [trailerLoad, setTrailerLoad] = useState(false);
   

    const [trailerUrl, setTrailerUrl] = useState("");

    useEffect(() =>{
        async function fetchData(){
            const request = await axios.get(fetchUrl);
            setMovies(request.data.results);
            return request;
            
        }
        
        fetchData();


        if(movies.length === 0){
            setLoading(true);
        }else{
            setLoading(false);
        }


    }, [fetchUrl,movies]);

    const opts ={
        height: "390",
        width: "100%",
        playerVars: {
            autoplay: 1,
        },
    };

    
    const handleClick = (movie) =>{

        setTrailerLoad(!trailerLoad);

        if(trailerUrl){
            setTrailerUrl('');  
        }else{
            // setTrailerLoad(true);
            movieTrailer(movie?.name || movie.title || movie.original_name || "")
            .then(url =>{
                const urlParams = new URLSearchParams(new URL(url).search) ;
                setTrailerUrl(urlParams.get('v'));
            }).catch(error => console.log(error));
            
        }

    }

    return (
        <div className="row">
           <h2>{title}</h2>
                {
                    loading && 
                    <CircularProgress/>    
                }
            
            <div className="row__posters">
                
                {movies.map((movie) => (
                    <img 
                        onClick={()=> handleClick(movie)}
                        className={`row__poster ${isLargeRow && "row__posterLarge"}`}
                        key={movie.id}
                        src={`${base_url}${ isLargeRow ? movie.poster_path : movie.backdrop_path}`} 
                        alt={movie.name} 
                    />
                ))}
                
            </div>

            {
                 trailerLoad && <CircularProgress/> 
            }

            {
                 trailerUrl &&   <YouTube videoId={trailerUrl} opts={opts}  id="youtube" /> 
            }
           
        
        </div>
    )
}

export default Row
