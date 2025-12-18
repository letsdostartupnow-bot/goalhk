import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";

// 當客人提交goal時
async function saveJob(goalData: { title: string; description: string; [key: string]: any }) {
  try {
    await addDoc(collection(db, "jobs"), {
      ...goalData,
      createdAt: new Date(),
      status: "live"
    });
    alert("Job 保存成功！已加到Job Board");
  } catch (e) {
    console.error("Error: ", e);
  }
}

export default saveJob;