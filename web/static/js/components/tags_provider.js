import React, { Component } from 'react'
import { connect } from 'react-redux'

import { DragDropContext } from 'react-dnd'
import MultiBackend from 'react-dnd-multi-backend'
import HTML5toTouch from 'react-dnd-multi-backend/lib/HTML5toTouch'

import Tags from './tags'
import Articles from './articles'

class TagsProvider extends Component {
  render() {
    return (
      <div>
        <div className="tags-container">
          <Tags tag_ids={this.props.tag_ids} />
        </div>

        <Articles />
      </div>
    )
  }
}

TagsProvider = DragDropContext(MultiBackend(HTML5toTouch))(TagsProvider)

function mapStateToProps(state) {
  return {
    tag_ids: state.data.tag_ids
  }
}

export default connect(mapStateToProps)(TagsProvider)