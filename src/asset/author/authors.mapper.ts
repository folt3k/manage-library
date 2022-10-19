import { AssetAuthor } from "@prisma/client";
import { ListAssetAuthorRO } from "./authors.models";

export const listAssetAuthorMapper = (
  author: AssetAuthor & { _count: { assets: number } }
): ListAssetAuthorRO => ({
  id: author.id,
  firstName: author.firstName,
  lastName: author.lastName,
  assetsCount: author._count.assets,
});
