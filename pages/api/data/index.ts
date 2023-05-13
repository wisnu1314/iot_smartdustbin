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

  let resp;
  try {
    switch (req.method) {
      case "GET":
        resp = await db.collection("dustbin_datas").get();
        const results = resp.docs.map(entry => {
          return { ...entry.data(), id: entry.id };
        });
        res.status(200).json({ data: results });
        break;
      case "POST":
        // console.log(req.body);
        if (req.body.id_firestore.includes(";")) {
          resp = await db
            .collection("dustbin_datas")
            .doc(String(req.body.id_firestore))
            .set({ ...req.body, created: new Date().toISOString() });

          res.status(201).json({ message: "data added" });
        }

        break;
      default:
        break;
    }
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}
