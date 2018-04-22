import React, {Component} from 'react';
import ReactMapGl from 'react-map-gl'
import ControlPanel from './control-panel'

export default class MyMap extends Component(){
  state = {
    mapStyle: '',
    viewport: {
      latitude: 37.805,
      longitude: -122.447,
      zoom: 15.5,
      bearing: 0,
      pitch: 0,
      width: 500,
      height: 500
    }
  }

  componentDidMount() {
    window.addEventListener('resize', this._resize);
    this._resize();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this._resize);
  }

  _resize = () => {
    this.setState({
      viewport: {
        ...this.state.viewport,
        width: this.props.width || window.innerWidth,
        height: this.props.height || window.innerHeight
      }
    });
  };

  _onViewportChange = viewport => this.setState({viewport});

  _onStyleChange = mapStyle => this.setState({mapStyle});

  render() {
    const {viewport, mapStyle} = this.state;

    return (
      <ReactMapGl
        {...this.state.viewport}
        mapStyle={mapStyle}
        onViewportChange={this._onViewportChange}
        mapboxApiAccessToken="pk.eyJ1IjoiY3RpbW1pbnMiLCJhIjoiY2pnOGtnd2xhMGIwNDJ3cWV2NGQ3anVybCJ9.lDieEIpjwFJEGCx-N60Iyg" >
        <ControlPanel
          containerComponent={this.props.containerComponent}
          onChange={this._onStyleChange} />
      </ReactMapGl>
    )
  }
}