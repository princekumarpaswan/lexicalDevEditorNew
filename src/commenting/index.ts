/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { LexicalEditor } from 'lexical'

import { Provider, TOGGLE_CONNECT_COMMAND } from '@lexical/yjs'
import { COMMAND_PRIORITY_LOW } from 'lexical'
import { useEffect, useState } from 'react'
import {
  Array as YArray,
  Map as YMap,
  Transaction,
  YArrayEvent,
  YEvent,
} from 'yjs'
import { getComments, submitComment } from '../api/tutorialContentAPI'

export type Comment = {
  author: string
  content: string
  deleted: boolean
  id: string
  timeStamp: number
  type: 'comment'
}

export type Thread = {
  comments: Array<Comment>
  id: string
  quote: string
  type: 'thread'
}

export type Comments = Array<Thread | Comment>

function createUID(): string {
  return Math.random()
    .toString(36)
    .replace(/[^a-z]+/g, '')
    .substr(0, 5)
}

export function createComment(
  content: string,
  author: string,
  id?: string,
  timeStamp?: number,
  deleted?: boolean,
): Comment {
  return {
    author,
    content,
    deleted: deleted === undefined ? false : deleted,
    id: id === undefined ? createUID() : id,
    timeStamp: timeStamp === undefined ? performance.now() : timeStamp,
    type: 'comment',
  }
}

export function createThread(
  quote: string,
  comments: Array<Comment>,
  id?: string,
): Thread {
  return {
    comments,
    id: id === undefined ? createUID() : id,
    quote,
    type: 'thread',
  }
}

function cloneThread(thread: Thread): Thread {
  return {
    comments: Array.from(thread.comments),
    id: thread.id,
    quote: thread.quote,
    type: 'thread',
  }
}

function markDeleted(comment: Comment): Comment {
  return {
    author: comment.author,
    content: '[Deleted Comment]',
    deleted: true,
    id: comment.id,
    timeStamp: comment.timeStamp,
    type: 'comment',
  }
}

function triggerOnChange(commentStore: CommentStore): void {
  const listeners = commentStore._changeListeners
  for (const listener of listeners) {
    listener()
  }
}

export class CommentStore {
  _editor: LexicalEditor
  _comments: Comments
  _changeListeners: Set<() => void>
  _collabProvider: null | Provider

  constructor(editor: LexicalEditor) {
    this._comments = []
    this._editor = editor
    this._collabProvider = null
    this._changeListeners = new Set()
  }

  isCollaborative(): boolean {
    return this._collabProvider !== null
  }

  getComments(): Comments {
    return this._comments
  }

  async _submitCommentsToAPI(): Promise<void> {
    const comments = this.getComments()
    const id = localStorage.getItem('subTopicID')
    try {
      await submitComment(comments, id)
      await this._fetchAndUpdateComments()
    } catch (error) {
      console.error('Error submitting comments:', error)
    }
  }

  async _fetchAndUpdateComments(): Promise<void> {
    const id = localStorage.getItem('subTopicID')
    try {
      const data = await getComments(id)
      this._comments = data?.data?.comments || []
      triggerOnChange(this)
    } catch (error) {
      console.error('Error fetching comments:', error)
    }
  }

  addComment(
    commentOrThread: Comment | Thread,
    thread?: Thread,
    offset?: number,
  ): void {
    const nextComments = Array.from(this._comments)
    // The YJS types explicitly use `any` as well.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sharedCommentsArray: YArray<any> | null = this._getCollabComments()

    if (thread !== undefined && commentOrThread.type === 'comment') {
      for (let i = 0; i < nextComments.length; i++) {
        const comment = nextComments[i]
        if (comment.type === 'thread' && comment.id === thread.id) {
          const newThread = cloneThread(comment)
          nextComments.splice(i, 1, newThread)
          const insertOffset =
            offset !== undefined ? offset : newThread.comments.length
          if (this.isCollaborative() && sharedCommentsArray !== null) {
            const parentSharedArray = sharedCommentsArray.get(i).get('comments')
            this._withRemoteTransaction(() => {
              const sharedMap = this._createCollabSharedMap(commentOrThread)
              parentSharedArray.insert(insertOffset, [sharedMap])
            })
          }
          newThread.comments.splice(insertOffset, 0, commentOrThread)
          break
        }
      }
    } else {
      const insertOffset = offset !== undefined ? offset : nextComments.length
      if (this.isCollaborative() && sharedCommentsArray !== null) {
        this._withRemoteTransaction(() => {
          const sharedMap = this._createCollabSharedMap(commentOrThread)
          sharedCommentsArray.insert(insertOffset, [sharedMap])
        })
      }
      nextComments.splice(insertOffset, 0, commentOrThread)
    }
    this._comments = nextComments
    triggerOnChange(this)
    triggerOnChange(this)
    this._submitCommentsToAPI()
  }

  deleteCommentOrThread(
    commentOrThread: Comment | Thread,
    thread?: Thread,
  ): { markedComment: Comment; index: number } | null {
    const nextComments = Array.from(this._comments)
    // The YJS types explicitly use `any` as well.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sharedCommentsArray: YArray<any> | null = this._getCollabComments()
    let commentIndex: number | null = null

    if (thread !== undefined) {
      for (let i = 0; i < nextComments.length; i++) {
        const nextComment = nextComments[i]
        if (nextComment.type === 'thread' && nextComment.id === thread.id) {
          const newThread = cloneThread(nextComment)
          nextComments.splice(i, 1, newThread)
          const threadComments = newThread.comments
          commentIndex = threadComments.indexOf(commentOrThread as Comment)
          if (this.isCollaborative() && sharedCommentsArray !== null) {
            const parentSharedArray = sharedCommentsArray.get(i).get('comments')
            this._withRemoteTransaction(() => {
              parentSharedArray.delete(commentIndex)
            })
          }
          threadComments.splice(commentIndex, 1)
          break
        }
      }
    } else {
      commentIndex = nextComments.indexOf(commentOrThread)
      if (this.isCollaborative() && sharedCommentsArray !== null) {
        this._withRemoteTransaction(() => {
          sharedCommentsArray.delete(commentIndex as number)
        })
      }
      nextComments.splice(commentIndex, 1)
    }
    this._comments = nextComments
    triggerOnChange(this)

    triggerOnChange(this)
    this._submitCommentsToAPI()

    if (commentOrThread.type === 'comment') {
      return {
        index: commentIndex as number,
        markedComment: markDeleted(commentOrThread as Comment),
      }
    }

    return null
  }

  registerOnChange(onChange: () => void): () => void {
    const changeListeners = this._changeListeners
    changeListeners.add(onChange)
    return () => {
      changeListeners.delete(onChange)
    }
  }

  _withRemoteTransaction(fn: () => void): void {
    const provider = this._collabProvider
    if (provider !== null) {
      // @ts-expect-error doc does exist
      const doc = provider.doc
      doc.transact(fn, this)
    }
  }

  _withLocalTransaction(fn: () => void): void {
    const collabProvider = this._collabProvider
    try {
      this._collabProvider = null
      fn()
    } finally {
      this._collabProvider = collabProvider
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _getCollabComments(): null | YArray<any> {
    const provider = this._collabProvider
    if (provider !== null) {
      // @ts-expect-error doc does exist
      const doc = provider.doc
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return doc.get('comments', YArray) as YArray<any>
    }
    return null
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _createCollabSharedMap(commentOrThread: Comment | Thread): YMap<any> {
    const sharedMap = new YMap()
    const type = commentOrThread.type
    const id = commentOrThread.id
    sharedMap.set('type', type)
    sharedMap.set('id', id)
    if (type === 'comment') {
      sharedMap.set('author', commentOrThread.author)
      sharedMap.set('content', commentOrThread.content)
      sharedMap.set('deleted', commentOrThread.deleted)
      sharedMap.set('timeStamp', commentOrThread.timeStamp)
    } else {
      sharedMap.set('quote', commentOrThread.quote)
      const commentsArray = new YArray()
      commentOrThread.comments.forEach((comment, i) => {
        const sharedChildComment = this._createCollabSharedMap(comment)
        commentsArray.insert(i, [sharedChildComment])
      })
      sharedMap.set('comments', commentsArray)
    }
    return sharedMap
  }

  registerCollaboration(provider: Provider): () => void {
    this._collabProvider = provider
    const sharedCommentsArray = this._getCollabComments()

    const connect = () => {
      provider.connect()
    }

    const disconnect = () => {
      try {
        provider.disconnect()
      } catch (e) {
        // Do nothing
      }
    }

    const unsubscribe = this._editor.registerCommand(
      TOGGLE_CONNECT_COMMAND,
      (payload) => {
        if (connect !== undefined && disconnect !== undefined) {
          const shouldConnect = payload

          if (shouldConnect) {
            // eslint-disable-next-line no-console
            console.log('Comments connected!')
            connect()
          } else {
            // eslint-disable-next-line no-console
            console.log('Comments disconnected!')
            disconnect()
          }
        }

        return false
      },
      COMMAND_PRIORITY_LOW,
    )

    const onSharedCommentChanges = (
      // The YJS types explicitly use `any` as well.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      events: Array<YEvent<any>>,
      transaction: Transaction,
    ) => {
      if (transaction.origin !== this) {
        for (let i = 0; i < events.length; i++) {
          const event = events[i]

          if (event instanceof YArrayEvent) {
            const target = event.target
            const deltas = event.delta
            let offset = 0

            for (let s = 0; s < deltas.length; s++) {
              const delta = deltas[s]
              const insert = delta.insert
              const retain = delta.retain
              const del = delta.delete
              const parent = target.parent
              const parentThread =
                target === sharedCommentsArray
                  ? undefined
                  : parent instanceof YMap &&
                    (this._comments.find((t) => t.id === parent.get('id')) as
                      | Thread
                      | undefined)

              if (Array.isArray(insert)) {
                insert
                  .slice()
                  .reverse()
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  .forEach((map: YMap<any>) => {
                    const id = map.get('id')
                    const type = map.get('type')

                    const commentOrThread =
                      type === 'thread'
                        ? createThread(
                            map.get('quote'),
                            map
                              .get('comments')
                              .toArray()
                              .map(
                                (
                                  innerComment: Map<
                                    string,
                                    string | number | boolean
                                  >,
                                ) =>
                                  createComment(
                                    innerComment.get('content') as string,
                                    innerComment.get('author') as string,
                                    innerComment.get('id') as string,
                                    innerComment.get('timeStamp') as number,
                                    innerComment.get('deleted') as boolean,
                                  ),
                              ),
                            id,
                          )
                        : createComment(
                            map.get('content'),
                            map.get('author'),
                            id,
                            map.get('timeStamp'),
                            map.get('deleted'),
                          )
                    this._withLocalTransaction(() => {
                      this.addComment(
                        commentOrThread,
                        parentThread as Thread,
                        offset,
                      )
                    })
                  })
              } else if (typeof retain === 'number') {
                offset += retain
              } else if (typeof del === 'number') {
                for (let d = 0; d < del; d++) {
                  const commentOrThread =
                    parentThread === undefined || parentThread === false
                      ? this._comments[offset]
                      : parentThread.comments[offset]
                  this._withLocalTransaction(() => {
                    this.deleteCommentOrThread(
                      commentOrThread,
                      parentThread as Thread,
                    )
                  })
                  offset++
                }
              }
            }
          }
        }
      }
    }

    if (sharedCommentsArray === null) {
      return () => null
    }

    sharedCommentsArray.observeDeep(onSharedCommentChanges)

    connect()

    return () => {
      sharedCommentsArray.unobserveDeep(onSharedCommentChanges)
      unsubscribe()
      this._collabProvider = null
    }
  }
}
function getUniqueComments(comments: Comments): Comments {
  const uniqueCommentsMap = new Map()
  comments.forEach((comment) => uniqueCommentsMap.set(comment.id, comment))
  return Array.from(uniqueCommentsMap.values())
}

export function useCommentStore(commentStore: CommentStore): Comments {
  const [newcomments, setComments] = useState<Comments>(
    commentStore.getComments(),
  )

  useEffect(() => {
    return commentStore.registerOnChange(() => {
      setComments(commentStore.getComments())
    })
  }, [])

  const comments = getUniqueComments(newcomments)
  // localStorage.setItem('comments', comments)
  // const id = localStorage.getItem('subTopicID')

  // useEffect(() => {
  //   if (comments.length > 0 ) {
  //     submitComment(comments, id)
  //   }
  // }, [comments])

    useEffect(() => {
    const id = localStorage.getItem('subTopicID');
    if (comments.length > 0 && id) {
      submitComment(comments, id)
        .then(() => commentStore._fetchAndUpdateComments())
        .catch(error => console.error('Error submitting comments:', error));
    }
  }, []);

  return comments
}

// export async function fetchCommentsAndAddToStore(
//   commentStore: CommentStore,
//   apiUrl: string,
// ): Promise<void> {
//   try {
//     const response = await fetch(apiUrl)
//     if (!response.ok) {
//       throw new Error('Failed to fetch comments')
//     }
//     const id = localStorage.getItem('subTopicID')
//     const data: Comments = await getComments(id)

//     data?.data?.comments.forEach(
//       (item: {
//         type: string
//         quote: string
//         comments: any[]
//         id: string | undefined
//         content: string
//         author: string
//         timeStamp: number | undefined
//         deleted: boolean | undefined
//       }) => {
//         if (item.type === 'thread') {
//           const thread = createThread(
//             item.quote,
//             item.comments.map(
//               (comment: {
//                 content: string
//                 author: string
//                 id: string | undefined
//                 timeStamp: number | undefined
//                 deleted: boolean | undefined
//               }) =>
//                 createComment(
//                   comment.content,
//                   comment.author,
//                   comment.id,
//                   comment.timeStamp,
//                   comment.deleted,
//                 ),
//             ),
//             item.id,
//           )
//           commentStore.addComment(thread)
//         } else {
//           const comment = createComment(
//             item.content,
//             item.author,
//             item.id,
//             item.timeStamp,
//             item.deleted,
//           )
//           commentStore.addComment(comment)
//         }
//       },
//     )
//   } catch (error) {
//     // eslint-disable-next-line no-console
//     console.error('Error fetching comments:', error)
//   }
// }



export async function fetchCommentsAndAddToStore(commentStore: CommentStore): Promise<void> {
  try {
    const id = localStorage.getItem('subTopicID');
    const data: Comments = await getComments(id);

    console.log({ data });

    data?.data?.comments.forEach((item: { type: string; quote: string; comments: any[]; id: string | undefined; content: string; author: string; timeStamp: number | undefined; deleted: boolean | undefined }) => {
  
     
      if (item.type === 'thread') {
        
        const thread = createThread(
          item.quote,
          item.comments.map((comment: { content: string; author: string; id: string | undefined; timeStamp: number | undefined; deleted: boolean | undefined }) =>
            createComment(
              comment.content,
              comment.author,
              comment.id,
              comment.timeStamp,
              comment.deleted,
            ),
          ),
          item.id,
        );
           console.log('here');
        commentStore.addComment(thread);
      } else {
        const comment = createComment(
          item.content,
          item.author,
          item.id,
          item.timeStamp,
          item.deleted,
        );
        commentStore.addComment(comment);
      }
    });
  } catch (error) {
    console.error('Error fetching comments:', error);
  }
}

