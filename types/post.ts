import { Request } from "express";

export interface PostInterface {
  title: string;
  description: string;
}

export interface CommentInterface {
  id: string;
  post: string;
  user: string;
  description: string;
  author: string;
  date: Date;
}
