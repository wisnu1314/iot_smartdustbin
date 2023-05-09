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
  try {
    let resp;
    let results;
    const body = req.body;
    switch (req.method) {
      case "GET":
        resp = await db.collection("full_predict").get();
        results = resp.docs.map(entry => {
          return { ...entry.data(), id: entry.id };
        });
        res.status(200).json({ data: results });
        break;
      default:
        break;
    }
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}
