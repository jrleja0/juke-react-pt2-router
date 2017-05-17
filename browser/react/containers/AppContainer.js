import React, { Component } from 'react';
import axios from 'axios';

import initialState from '../initialState';
import AUDIO from '../audio';

import Albums from '../components/Albums';
import Album from '../components/Album';
import Sidebar from '../components/Sidebar';
import Player from '../components/Player';
import Artists from '../components/Artists';


import { convertAlbum, convertAlbums, skip } from '../utils';

export default class AppContainer extends Component {

  constructor (props) {
    super(props);
    this.state = initialState;

    this.toggle = this.toggle.bind(this);
    this.toggleOne = this.toggleOne.bind(this);
    this.next = this.next.bind(this);
    this.prev = this.prev.bind(this);
    this.selectAlbum = this.selectAlbum.bind(this);
    this.deselectAlbum = this.deselectAlbum.bind(this);
    this.selectArtist = this.selectArtist.bind(this);
  }

  componentDidMount () {
    let albumsPromise = axios.get('/api/albums/')
      .then(res => res.data)
      .catch(console.error('error'));
      // .then(albums => this.onLoad(convertAlbums(albums)));

    let artistsPromise = axios.get('/api/artists/')
      .then(res => res.data)
      .catch(console.error('error'));
      // .then(artistsFromServer => this.onLoad(null, artistsFromServer))

    Promise.all([albumsPromise, artistsPromise])
    .then(resultArray => {
      let returnedAlbums = resultArray[0];
      let returnedArtists = resultArray[1];
      this.onLoad({ albums: convertAlbums(returnedAlbums), artists: returnedArtists });
      })
      .catch(console.error('error'));

    AUDIO.addEventListener('ended', () =>
      this.next());
    AUDIO.addEventListener('timeupdate', () =>
      this.setProgress(AUDIO.currentTime / AUDIO.duration));

  }

  onLoad(newStateObj) {
    this.setState(newStateObj);
  }
  // onLoad (albums, artists) {
  //   this.setState({
  //     albums: albums,
  //     artists: artists
  //   });
  // }
// PREVIOUS
  // onLoad (albums) {
  //   this.setState({
  //     albums: albums
  //   });
  // }


  play () {
    AUDIO.play();
    this.setState({ isPlaying: true });
  }

  pause () {
    AUDIO.pause();
    this.setState({ isPlaying: false });
  }

  load (currentSong, currentSongList) {
    AUDIO.src = currentSong.audioUrl;
    AUDIO.load();
    this.setState({
      currentSong: currentSong,
      currentSongList: currentSongList
    });
  }

  startSong (song, list) {
    this.pause();
    this.load(song, list);
    this.play();
  }

  toggleOne (selectedSong, selectedSongList) {
    if (selectedSong.id !== this.state.currentSong.id)
      this.startSong(selectedSong, selectedSongList);
    else this.toggle();
  }

  toggle () {
    if (this.state.isPlaying) this.pause();
    else this.play();
  }

  next () {
    this.startSong(...skip(1, this.state));
  }

  prev () {
    this.startSong(...skip(-1, this.state));
  }

  setProgress (progress) {
    this.setState({ progress: progress });
  }

  selectAlbum (albumId) {
    axios.get(`/api/albums/${albumId}`)
      .then(res => res.data)
      .then(album => this.setState({
        selectedAlbum: convertAlbum(album)
      }));
  }

  selectArtist (artistId) {
    const gettingArtist = axios.get(`/api/artists/${artistId}`)
      .then(res => res.data)
      .catch(console.error('error'));

    const gettingArtistAlbums = axios.get(`/api/artists/${artistId}/albums`)
      .then(res => res.data)
      .catch(console.error('error'));

    const gettingArtistSongs = axios.get(`/api/artists/${artistId}/songs`)
      .then(res => res.data)
      .catch(console.error('error'));

    Promise.all([gettingArtist, gettingArtistAlbums, gettingArtistSongs])
      .then(resultArray => {
        const returnedArtist = resultArray[0];
        const returnedAlbums = resultArray[1];
        const returnedSongs = resultArray[2];
        console.log('artist:', returnedArtist, ', albums:', returnedAlbums, ', songs:', returnedSongs);
        this.onLoad({ selectedArtist: returnedArtist, albums: returnedAlbums, songs: returnedSongs });
      })
      .catch(console.error('error'));
  }

  deselectAlbum () {
    this.setState({ selectedAlbum: {}});
  }

  render () {
    return (
      <div id="main" className="container-fluid">
        <div className="col-xs-2">
          <Sidebar deselectAlbum={this.deselectAlbum} />
        </div>
        <div className="col-xs-10">
        {
          this.props.children ?
            React.cloneElement(this.props.children, {
              album: this.state.selectedAlbum,
              albums: this.state.albums,
              songs: this.state.songs,
              selectAlbum: this.selectAlbum,
              artists: this.state.artists,
              selectedArtist: this.state.selectedArtist,
              selectArtist: this.selectArtist,
              currentSong: this.state.currentSong,
              isPlaying: this.state.isPlaying,
              toggle: this.toggleOne
            })
            : null
        }
        </div>
        <Player
          currentSong={this.state.currentSong}
          currentSongList={this.state.currentSongList}
          isPlaying={this.state.isPlaying}
          progress={this.state.progress}
          next={this.next}
          prev={this.prev}
          toggle={this.toggle}
        />
      </div>
    );
  }
}
