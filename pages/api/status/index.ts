import {
  collection,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import admin from "../../../firebase";

import type { NextApiRequest, NextApiResponse } from "next";
const db = admin.firestore();
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    let resp;
    let results;
    const body = req.body;
    switch (req.method) {
      case "GET":
        resp = await db.collection("status").get();
        results = resp.docs.map((entry) => {
          return { ...entry.data(), id: entry.id };
        });
        res.status(200).json({ data: results });
        break;
      case "PUT":
        resp = await db
          .collection("status")
          .doc(String(body.id))
          .update({ period: body.period, updated: new Date().toISOString() });
        res.status(201).json({ message: "status updated" });
        break;
      default:
        break;
    }
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}
