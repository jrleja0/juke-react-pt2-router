import React from 'react';
import {Link} from 'react-router'



export default class Artists extends React.Component {


  render () {
    console.log('this.props', this.props)


    return (
      <div>
        <h3>Artists</h3>
          <div className="list-group">
          {
            this.props.artists.map(artist => {
              return (
                <div className="list-group-item" key={artist.id}>
                  {/* determine where to actually Link to later! */}
                  <Link to="">{ artist.name }</Link>
                </div>
              )
            })
          }
        </div>
      </div>
      )
    }
}
