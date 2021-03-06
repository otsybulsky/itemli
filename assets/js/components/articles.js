import _ from 'lodash'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import Article from './article'
import {
  fetchArticles,
  fetchArticlesUnbound,
  deleteArticlesUnbound
} from '../socket'

import { DragDropContext } from 'react-dnd'
import MultiBackend from 'react-dnd-multi-backend'
import HTML5toTouch from 'react-dnd-multi-backend/lib/HTML5toTouch'

import { editArticle, editTag, showTagsList } from '../actions'
import { deleteTag } from '../socket'
import ArticleEdit from './article_edit'

import { Button } from 'react-materialize'

import confirmDialog from './dialogs/confirm'
import ReactTooltip from 'react-tooltip'

class Articles extends Component {
  renderArticles() {
    const { articles, article_edit_flag } = this.props
    if (!articles || article_edit_flag) {
      return null
    }
    return articles.map((article, i) => {
      return <Article index={i} key={article.id} article={article} />
    })
  }

  onShowTags(event) {
    this.props.showTagsList()
  }

  onAddArticle(event) {
    this.props.editArticle()
  }

  onOpenArticles(event) {
    const { articles } = this.props
    if (articles && articles.length > 0) {
      confirmDialog(`Open ${articles.length} tabs in your browser?`).then(
        () => {
          articles.map(article => {
            if (article.url) {
              window.open(article.url, '_blank')
            }
          })
        },
        () => {}
      )
    }
  }

  onClearList(event) {
    const { articles, deleteArticlesUnbound } = this.props
    if (articles && articles.length > 0) {
      confirmDialog(`Confirm delete ${articles.length} unbound articles?`).then(
        () => {
          deleteArticlesUnbound()
        },
        () => {}
      )
    }
  }

  renderInterface(tag) {
    if (!_.isEmpty(tag.title)) {
      return null
    } else {
      return (
        <div>
          <ul className="tag-toolbar">
            <li className="waves-effect waves-light" onClick={this.onAddTag}>
              <a>
                <i className="material-icons">add</i>
              </a>
            </li>
            <li
              className="waves-effect waves-light"
              onClick={ev => this.onActionTag(ev)}
            >
              <a>
                <i className="material-icons">edit</i>
              </a>
            </li>

            <li className="waves-effect waves-light" onClick={this.onDeleteTag}>
              <a>
                <i className="material-icons">delete</i>
              </a>
            </li>
          </ul>
        </div>
      )
    }
  }

  renderArticleEditForm() {
    const { article_edit_flag } = this.props
    if (!article_edit_flag) {
      return null
    }
    return <ArticleEdit />
  }

  onAddTag = () => {
    this.props.editTag()
  }
  onDeleteTag = () => {
    const { tag_id, tags, deleteTag } = this.props
    const tag = tags[tag_id]
    if (tag) {
      confirmDialog(`Delete tag ${tag.title}?`).then(
        () => {
          //delete the tag confirmed
          deleteTag(tag)
        },
        () => {
          //console.log('delete cancel')
        }
      )
    }
  }

  onActionTag(event) {
    const { tag_id, tags, editTag } = this.props
    editTag(tags[tag_id])
    event.stopPropagation()
  }

  renderTag() {
    const {
      tag_id,
      tags,
      article_edit_flag,
      show_tags_list,
      articles_without_tag_count,
      tag_ids
    } = this.props

    if (!tag_id && !articles_without_tag_count) {
      if (tag_ids.length > 0) {
        this.props.fetchArticles(tag_ids[0].id)
      }
      return null
    }

    if (article_edit_flag) {
      return null
    }

    const data_tip_show_tags = show_tags_list
      ? 'Hide tags list'
      : 'Show tags list'

    let menuInterface

    if (tag_id) {
      menuInterface = (
        <div className="right">
          <a
            id="btn-open-in-browser"
            className="tag-body-interface waves-effect waves-light btn-floating blue"
            data-tip="Open all in browser"
          >
            <i
              className="material-icons medium "
              onClick={ev => this.onOpenArticles(ev)}
            >
              open_in_browser
            </i>
          </a>
        </div>
      )

      return (
        <div className="tag-header">
          <div className="tag-body-toolbar">
            {menuInterface}
            <a
              className="tag-body-interface waves-effect waves-light btn-floating green"
              data-tip={data_tip_show_tags}
              onClick={ev => this.onShowTags(ev)}
            >
              <i className="material-icons">menu</i>
            </a>
            <a
              id="btn-edit-tag"
              className="right tag-body-interface waves-effect waves-light btn-floating blue"
              data-tip="Edit current tag"
              onClick={ev => this.onActionTag(ev)}
            >
              <i className="material-icons medium">edit</i>
            </a>

            <ReactTooltip />
            <h5
              className="tag-body-interface"
              onClick={ev => this.onActionTag(ev)}
            >
              {tags[tag_id].title}
            </h5>
          </div>
          {this.renderInterface(tags[tag_id])}
          <div className="block-with-text">{tags[tag_id].description}</div>
        </div>
      )
    } else {
      menuInterface = (
        <div className="right">
          <a
            id="btn-delete-unbound-articles"
            className="tag-body-interface waves-effect waves-light btn-floating blue"
            data-tip="Delete all unbound articles"
          >
            <i
              className="material-icons medium "
              onClick={ev => this.onClearList(ev)}
            >
              delete_forever
            </i>
          </a>
          <ReactTooltip />
        </div>
      )

      return (
        <div className="tag-header">
          <div className="tag-body-toolbar">
            {menuInterface}
            <a
              className="tag-body-interface waves-effect waves-light btn-floating green"
              data-tip={data_tip_show_tags}
              onClick={ev => this.onShowTags(ev)}
            >
              <i className="material-icons">menu</i>
            </a>
            <ReactTooltip />
            <h5 className="tag-body-interface">Articles unbound</h5>
          </div>
        </div>
      )
    }
  }

  componentWillReceiveProps(nextProps) {
    const { tag_id, articles, fetchArticles, fetchArticlesUnbound } = nextProps
    if (!articles) {
      if (tag_id) {
        fetchArticles(tag_id)
      } else {
        fetchArticlesUnbound()
      }
    }
  }

  render() {
    const { articles } = this.props
    return (
      <div className="articles-container">
        {this.renderArticleEditForm()}
        {this.renderTag()}
        <div className="article-list">{this.renderArticles()}</div>
      </div>
    )
  }
}

function mapStateToProps(store) {
  return {
    articles: store.data.articles,
    tags: store.data.tags,
    tag_id: store.data.current_tag_id,
    article_edit_flag: store.data.article_edit_flag,
    fetch_articles_flag: store.data.fetch_articles_flag,
    show_tags_list: store.interface.show_tags_list,
    articles_without_tag_count: store.data.articles_without_tag_count,
    tag_ids: store.data.tag_ids
  }
}

export default connect(
  mapStateToProps,
  {
    fetchArticles,
    fetchArticlesUnbound,
    deleteArticlesUnbound,
    editArticle,
    editTag,
    deleteTag,
    showTagsList
  }
)(Articles)
