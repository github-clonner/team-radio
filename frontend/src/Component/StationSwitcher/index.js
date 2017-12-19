import React, { Component } from 'react';
import Slider from 'react-slick';
import './style.css';

class StationSwitcher extends Component {
  constructor() {
    super();
    this.state = {
      width: window.innerWidth,
    };
  }

  componentWillMount() {
    window.addEventListener('resize', this.handleWindowSizeChange);
  }

  handleWindowSizeChange = () => {
    this.setState({ width: window.innerWidth });
  };

  render() {
    const { stationList } = this.props;
    const { width } = this.state;
    const isMobile = width <= 500;

    const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: isMobile
        ? Math.floor(width / 100)
        : Math.floor(width / 200),
      slidesToScroll: 1,
      swipeToSlide: true,
    };

    return (
      <Slider {...settings}>
        {stationList.map((station, index) => (
          <div key={index}>
            <img src={station.avatar} alt="" className="station_avatar" />
            <div className="station_info">
              <h1 className="station_title">{station.name}</h1>
              <span className="station_subtitle">{station.description}</span>
            </div>
          </div>
        ))}
      </Slider>
    );
  }
}

export default StationSwitcher;