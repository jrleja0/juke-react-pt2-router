import React from 'react';
import {Link} from 'react-router'


export default class Artist extends React.Component {
  componentDidMount() {
    console.log('hitting single artist')
    const artistId = this.props.params.artistId;
    this.props.selectArtist(artistId);
  }


  render () {
    const artist = this.props.selectedArtist;
    const albums = this.props.albums;
    const songs = this.props.songs;
    console.log('ARTIST:', artist, albums, songs)
    return(
      <div>
        <h3>{artist.name}</h3>
        <h4>{/*albums[0].name*/}</h4>
        <h4>{/*songs[0].name*/}</h4>
      </div>
    )
  }
}
