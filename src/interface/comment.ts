import { IArticle } from './article'
import { IUser } from './user'

export interface IComment {
  content: string
  userId: string
  articleId: string
  user?: IUser
  article?: IArticle
  createdAt: Date
  updatedAt: Date
  __v: number
  id: string
}
