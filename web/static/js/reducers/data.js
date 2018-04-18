import _ from 'lodash'

import { reorderTagsList } from '../helpers'
import {
  TABS_ADDED,
  TAGS_FETCH_ALL_OK,
  DROP_TAG,
  DRAG_ELEMENT_START,
  DRAG_ELEMENT_END,
  FETCH_LAYOUT_OK,
  FETCH_ARTICLES_OK,
  SAVE_LAYOUT_OK
} from '../constants'

const INIT_STATE = {
  saveLayout: null,
  current_tag_id: null,
  tag_ids: [],
  tags: {},
  articles: null
}

export default function(store = INIT_STATE, { type, payload }) {
  switch (type) {
    case SAVE_LAYOUT_OK:
      return {
        ...store,
        saveLayout: false
      }

    case FETCH_ARTICLES_OK:
      const { articles, tag_id } = payload
      return {
        ...store,
        articles: articles,
        current_tag_id: tag_id,
        saveLayout: true
      }
    case TABS_ADDED:
      return {
        ...store,
        tag_ids: [{ id: payload.id, sub_tags: [] }, ...store.tag_ids],
        tags: { ...{ [payload.id]: payload }, ...store.tags },
        saveLayout: true
      }

    case FETCH_LAYOUT_OK:
      const {
        layout: { tag_ids, current_tag_id },
        tags
      } = payload
      return {
        ...store,
        tag_ids: tag_ids,
        tags: _.mapKeys(tags, 'id'),
        current_tag_id: current_tag_id,
        articles: null,
        saveLayout: false
      }
    case DRAG_ELEMENT_START:
      return {
        ...store,
        saveLayout: false
      }
    case DRAG_ELEMENT_END:
      return { ...store, saveLayout: true }
    case DROP_TAG:
      const { source_id, target_id, createSubTag } = payload
      return {
        ...store,
        tag_ids: reorderTagsList(
          [...store.tag_ids],
          source_id,
          target_id,
          createSubTag
        )
      }

    default:
      return store
  }
}
