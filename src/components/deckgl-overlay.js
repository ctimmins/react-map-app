import React, {Component} from 'react';
import DeckGL from 'deck.gl';
import TripsLayer from './trips-layer';

const LIGHT_SETTINGS = {
  lightsPosition: [-74.05, 40.7, 8000, -73.5, 41, 5000],
  ambientRatio: 0.05,
  diffuseRatio: 0.6,
  specularRatio: 0.8,
  lightsStrength: [2.0, 0.0, 0.0, 0.0],
  numberOfLights: 2
};

export default class DeckGLOverlay extends Component {
  // static get defaultViewport() {
  //   return {
  //     longitude: -74,
  //     latitude: 40.72,
  //     zoom: 13,
  //     maxZoom: 16,
  //     pitch: 45,
  //     bearing: 0
  //   };
  // }

  render() {
    const {viewport, trips, trailLength, time} = this.props;

    if (!trips) {
      return null;
    }

    const layers = [
      new TripsLayer({
        id: 'trips',
        data: trips,
        getPath: d => d.segments,
        getColor: d => (d.vendor === 0 ? [253, 128, 93] : [23, 184, 190]),
        opacity: 0.3,
        strokeWidth: 2,
        trailLength,
        currentTime: time
      })
    ];

    return <DeckGL {...viewport} layers={layers} />;
  }
}
