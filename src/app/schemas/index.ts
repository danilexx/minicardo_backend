// @ts-nocheck

import { Request } from "express";
import { User } from "../models/User";

export interface ValidatedRequest<P = {}, B = any> extends Request<Partial<P>> {
  isValid: boolean;
  body: B;
}
export interface AuthenticatedAndValidatedRequest<P = {}, B = any>
  extends Request<Partial<P>> {
  isValid: boolean;
  body: B;
  user: User;
}
export interface AuthenticatedRequest<P = {}> extends Request<Partial<P>> {
  user: User;
}
