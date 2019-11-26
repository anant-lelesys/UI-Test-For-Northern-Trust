import {render} from 'react-dom';
import React, {Component} from 'react';
import Slider from "react-slick";
import fetch from 'isomorphic-fetch';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './index.css';


//The Pokemon component will show an individual pokemon monster
// It shows an image of the pokemon and
// shows the name of it as well.
class Pokemon extends Component{
  render(){
    const {pokemon,id} = this.props;
    return <div className="pokemon-species-sprite slide">
            <div className="pokemon-species-name"> <span>{pokemon.name}</span> <span>ID: {id}</span></div>
                <img src={require(`../public/sprites/${id}.png`)} alt={id} width="250" height="250" />
            </div>;
    }
}


//The PokemonList component shows nothing when it mounts for the first time.
//But right before it mounts on to the DOM, it makes an
//API call to fetch the first 151 pokemon from the api and
//then displays them using the Pokemon Component

class PokemonList extends Component{
  constructor(props){
    super(props);
    this.state = {
      species : [],
      fetched : false,
      loading : false,
    };
  }
  componentDidMount(){
    this.setState({
      loading : true
    });
    fetch('http://pokeapi.co/api/v2/pokemon?limit=15').then(res => res.json())
    .then(response=> {
      this.setState({
        species : response.results,
        loading : true,
        fetched : true
      });
    });
  }

  render(){
    var settings = {
        arrows: true,
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 3,
        nextArrow: <button>Next</button>,
        prevArrow: <buttton>Prev</buttton>
      };
    const {fetched, loading, species} = this.state;
    let content ;
    if (fetched) {
      content = 
        <div className="pokemon-species-list slider">
            <div className="slider-wrapper">
            <Slider {...settings}>{species.map((pokemon,index)=><Pokemon key={pokemon.name} id={index+1} pokemon={pokemon}/>)}</Slider>
            </div>
        </div>;
    } else if (loading && !fetched){
        content = <p> Loading ...</p>;
    }
    else {
      content = <div/>;
    }
    return  <div>
      {content}
    </div>;
  }
}


//This is the root component
class PokeApp extends Component{
  render(){
    return <div className="pokeapp">
      <h1> The PokeMon! </h1>
      <PokemonList/>
    </div>;
  }
}

render(<PokeApp/>,document.getElementById('root'))