import { Socket } from 'phoenix'
import {
  TABS_ADDED,
  SOCKET_CONNECTED,
  SOCKET_ERROR,
  TAGS_FETCH_ALL,
  TAGS_FETCH_ALL_OK,
  SAVE_LAYOUT,
  SAVE_LAYOUT_OK,
  FETCH_LAYOUT,
  FETCH_LAYOUT_OK,
  FETCH_ARTICLES,
  FETCH_ARTICLES_OK,
  SAVE_ARTICLES_INDEX,
  UPDATED_ARTICLES_INDEX,
  TAG_EDIT_APPLY,
  TAG_EDIT_APPLY_OK,
  FETCH_ARTICLES_UNBOUND,
  TAG_DELETE
} from './constants'

let socket = null
let channel = null

function socketError(err) {
  return { type: SOCKET_ERROR, payload: { error: err } }
}

export function fetchArticlesUnbound() {
  return dispatch => {
    dispatch({ type: FETCH_ARTICLES_UNBOUND })
    if (channel) {
      channel.push('articles:fetch_unbound').receive('ok', response => {
        dispatch({ type: FETCH_ARTICLES_OK, payload: response })
      })
    }
  }
}

export function deleteTag(params) {
  return dispatch => {
    dispatch({ type: TAG_DELETE, payload: params })
    if (channel) {
      const { id } = params
      channel
        .push('tag:delete', {
          tag_id: id
        })
        .receive('ok', message => {
          dispatch(fetchLayout())
        })
    }
  }
}

export function editTagApply(params) {
  return dispatch => {
    dispatch({ type: TAG_EDIT_APPLY, payload: params })
    if (channel) {
      const { id, title, description } = params
      channel
        .push('tag:edit', {
          tag_id: id,
          title: title,
          description: description
        })
        .receive('ok', message => {
          dispatch({ type: TAG_EDIT_APPLY_OK, payload: message })
          dispatch(fetchLayout(message.id))
        })
        .receive('error', err => {
          console.log(err)
          //dispatch(socketError(err))
        })
    }
    //
  }
}

export function saveArticlesIndex(params) {
  return dispatch => {
    dispatch({ type: SAVE_ARTICLES_INDEX, payload: params })
    if (channel) {
      const { tag_id, articles } = params

      let article_ids = articles.map(article => {
        return article.id
      })
      channel.push('tag:reorder_articles', {
        tag_id: tag_id,
        article_ids: { index: article_ids }
      })
    }
  }
}

export function saveLayoutToServer(params) {
  return dispatch => {
    if (channel) {
      dispatch({ type: SAVE_LAYOUT, payload: params })
      channel
        .push('layout:save', params)
        .receive('ok', message => {
          dispatch({ type: SAVE_LAYOUT_OK, payload: message })
        })
        .receive('error', err => {
          dispatch(socketError(err))
        })
    }
  }
}

export function fetchLayout(tag_id) {
  return dispatch => {
    if (channel) {
      dispatch({ type: FETCH_LAYOUT })
      channel.push('layout:fetch').receive('ok', response => {
        dispatch({ type: FETCH_LAYOUT_OK, payload: response })
        if (tag_id) {
          dispatch(fetchArticles(tag_id))
        }
      })
    }
  }
}

export function fetchArticles(tag_id) {
  const request = { tag_id: tag_id }
  return dispatch => {
    if (channel) {
      dispatch({ type: FETCH_ARTICLES, payload: request })
      channel.push('articles:fetch', request).receive('ok', response => {
        dispatch({ type: FETCH_ARTICLES_OK, payload: response })
      })
    }
  }
}

function updatedArticlesIndex(tag_id) {
  return dispatch => {
    dispatch({ type: UPDATED_ARTICLES_INDEX, payload: tag_id })
  }
}

export function fetchAllTags() {
  return dispatch => {
    if (channel) {
      dispatch({ type: TAGS_FETCH_ALL })
      channel
        .push('tags:fetch')
        .receive('ok', tags => {
          dispatch({ type: TAGS_FETCH_ALL_OK, payload: tags })
        })
        .receive('error', err => {
          dispatch(socketError(err))
        })
    }
  }
}

export function createSocket() {
  return dispatch => {
    socket = new Socket('/socket', { params: { token: window.userToken } })
    socket.connect()

    channel = socket.channel(`room:${window.channelId}`, {})

    channel
      .join()
      .receive('ok', resp => {
        dispatch({ type: SOCKET_CONNECTED })
      })
      .receive('error', err => {
        dispatch(socketError(err))
      })

    channel.onError(err => {
      dispatch(socketError(err))
    })

    channel.on('tabs:added', msg =>
      dispatch({ type: TABS_ADDED, payload: msg.content })
    )

    channel.on('layout:updated', () => {
      dispatch(fetchLayout())
    })

    channel.on('articles_index:updated', msg => {
      dispatch(updatedArticlesIndex(msg.tag_id))
    })
  }
}
