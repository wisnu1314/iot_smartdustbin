import {
  collection,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import admin from "../../../firebase";

import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const db = admin.firestore();
  switch (req.method) {
    case "GET":
      const resp = await db.collection("dustbin_data").get();
      const results = resp.docs.map(entry => entry.data());
      res.status(200).json({ data: results });
      break;
    default:
      break;
  }
}
