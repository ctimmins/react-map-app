import React, {Component} from 'react';
import ReactMapGl from 'react-map-gl'
import DeckGL, {ScatterplotLayer} from 'deck.gl';
import ControlPanel from './control-panel'
var geoViewport = require('@mapbox/geo-viewport');
var axios = require('axios')

const MAPBOX_TOKEN = process.env.MapboxAccessToken;

export default class MyMap extends Component {
  constructor(props) {
    super(props)
    this.state = {
      mapStyle: '',
      viewport: {
        latitude: 37.765040,
        longitude: -122.438534,
        zoom: 12,
        bearing: 0,
        pitch: 0,
        width: 500,
        height: 500
      },
      locations: [],
      bounds: []
    }
    this._onTransitionEnd = this._onTransitionEnd.bind(this);
    this._onViewportChange = this._onViewportChange.bind(this);
    this._onDragOver = this._onDragOver.bind(this);
  }


  componentDidMount() {
    window.addEventListener('resize', this._resize);
    this._resize();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this._resize);
    if (this._animationFrame) {
      window.cancelAnimationFrame(this._animationFrame);
    }
  }

  _resize = () => {
    this.setState({
      viewport: {
        ...this.state.viewport,
        width: this.props.width || window.innerWidth,
        height: this.props.height || window.innerHeight
      },
      bounds: geoViewport.bounds([this.state.viewport.longitude, this.state.viewport.latitude],
        this.state.viewport.zoom, [this.state.viewport.width, this.state.viewport.height], 512)
    });
  };

  _onViewportChange = viewport => {
    this.setState({viewport});
    this.setState({bounds: geoViewport.bounds([viewport.longitude, viewport.latitude], Math.floor(viewport.zoom), [viewport.width, viewport.height], 512)});
    // this.query_comma_api();
  }

  _onDragOver = event => {
    console.log("event")
    console.log(event)
  }

  _onTransitionEnd = event => {
    this.query_comma_api()
  }

  query_comma_api() {
    var self = this;
    var bounds = this.state.bounds;
    var pointsUrl = `/points/${bounds[1]}/${bounds[0]}/${bounds[3]}/${bounds[2]}`; // minLat,minLon,maxLat,maxLon
    console.log(pointsUrl);
    axios({
      method:'get',
      baseURL: 'http://localhost:5000/api/v1',
      url: pointsUrl,
      params: {
        limit: 5000
      }
    })
      .then(function(response) {
        self.setState({locations: response.data.data.map(x => { return { position: [x.lng, x.lat], radius: x.speed, color: [255, 92, 51] } })})
      });
  }

  render() {
    const {viewport, mapStyle, locations} = this.state;

    return (
      <ReactMapGl
        {...this.state.viewport}
        mapStyle="mapbox://styles/mapbox/dark-v9"
        onViewportChange={this._onViewportChange}
        onClick={this._onClick}
        onTransitionEnd={this._onTransitionEnd}
        mapboxApiAccessToken={MAPBOX_TOKEN} >
        <DeckGL
          {...this.state.viewport}
          useDevicePixels={false}
          layers={[
            new ScatterplotLayer({
              id: 'my-points',
              data: locations,
              radiusScale: 0.5,
              outline: false
            })]}
        />
      </ReactMapGl>
    )
  }
}