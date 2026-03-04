// นำเข้าฟังก์ชันที่จำเป็นจาก Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, orderBy, query } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// ใส่ Firebase Config ของคุณ
const firebaseConfig = {
  apiKey: "AIzaSyDv1u9Bm5pMIX6nY__xNk3OkLbxrINTUn0",
  authDomain: "cru-actitrack.firebaseapp.com",
  projectId: "cru-actitrack",
  storageBucket: "cru-actitrack.firebasestorage.app",
  messagingSenderId: "370601049848",
  appId: "1:370601049848:web:dd00fce513fe9b5b06c50d",
  measurementId: "G-XCTV5ERVT2"
};

// เริ่มต้นการเชื่อมต่อ Firebase และ Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// อ้างอิง elements จาก HTML
const form = document.getElementById('activityForm');
const activityList = document.getElementById('activityList');

// ฟังก์ชันสำหรับดึงข้อมูลมาแสดงผล
async function loadActivities() {
    activityList.innerHTML = ''; // เคลียร์รายการเก่าก่อน
    const q = query(collection(db, "activities"), orderBy("date", "desc"));
    const querySnapshot = await getDocs(q);
    
    querySnapshot.forEach((doc) => {
        const data = doc.data();
        const li = document.createElement('li');
        li.innerHTML = `
            <div>
                <strong>${data.name}</strong><br>
                <small>${data.date}</small>
            </div>
            <div>${data.hours} ชม.</div>
        `;
        activityList.appendChild(li);
    });
}

// ฟังก์ชันบันทึกข้อมูลเมื่อกด Submit
form.addEventListener('submit', async (e) => {
    e.preventDefault(); // ป้องกันหน้าเว็บรีเฟรช

    const name = document.getElementById('activityName').value;
    const date = document.getElementById('activityDate').value;
    const hours = document.getElementById('activityHours').value;

    try {
        // บันทึกข้อมูลลง Firestore ใน collection ชื่อ 'activities'
        await addDoc(collection(db, "activities"), {
            name: name,
            date: date,
            hours: parseInt(hours),
            timestamp: new Date()
        });
        
        alert("บันทึกข้อมูลกิจกรรมสำเร็จ!");
        form.reset(); // ล้างข้อมูลในฟอร์ม
        loadActivities(); // โหลดข้อมูลใหม่มาแสดง
        
    } catch (error) {
        console.error("Error adding document: ", error);
        alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    }
});

// โหลดข้อมูลทันทีเมื่อเปิดหน้าเว็บ
loadActivities();
