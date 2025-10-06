const absenBtn = document.getElementById("absenBtn");
const batalBtn = document.getElementById("batalBtn");
const statusText = document.getElementById("statusText");
const tbody = document.querySelector("#riwayatTable tbody");

const navHome = document.getElementById("navHome");
const navRiwayat = document.getElementById("navRiwayat");
const homeMenu = document.getElementById("home-menu");
const riwayatMenu = document.getElementById("riwayat-menu");

const exportPdf = document.getElementById("exportPdf");
const exportExcel = document.getElementById("exportExcel");

let dataAbsen = JSON.parse(localStorage.getItem("riwayatAbsen")) || [];

function renderTable() {
  tbody.innerHTML = "";
  dataAbsen.forEach((item) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${item.tanggal}</td><td>${item.keterangan}</td>`;
    tbody.appendChild(tr);
  });
}

// ====== LOGIKA ABSEN ======
absenBtn.addEventListener("click", () => {
  const today = new Date().toLocaleDateString("id-ID");
  const sudahAbsen = dataAbsen.some((x) => x.tanggal === today);

  if (sudahAbsen) {
    alert("Kamu sudah absen hari ini!");
    return;
  }

  dataAbsen.push({ tanggal: today, keterangan: "Hadir" });
  localStorage.setItem("riwayatAbsen", JSON.stringify(dataAbsen));
  renderTable();

  absenBtn.classList.add("hidden");
  batalBtn.classList.remove("hidden");
  statusText.textContent = `Sudah absen hari ini (${today})`;
});

// ====== LOGIKA BATAL ABSEN ======
batalBtn.addEventListener("click", () => {
  const today = new Date().toLocaleDateString("id-ID");
  dataAbsen = dataAbsen.filter((x) => x.tanggal !== today);
  localStorage.setItem("riwayatAbsen", JSON.stringify(dataAbsen));
  renderTable();

  batalBtn.classList.add("hidden");
  absenBtn.classList.remove("hidden");
  statusText.textContent = "Belum absen hari ini";
});

// ====== NAVIGASI ======
navHome.addEventListener("click", () => {
  navHome.classList.add("active");
  navRiwayat.classList.remove("active");
  homeMenu.classList.remove("hidden");
  riwayatMenu.classList.add("hidden");
});

navRiwayat.addEventListener("click", () => {
  navRiwayat.classList.add("active");
  navHome.classList.remove("active");
  homeMenu.classList.add("hidden");
  riwayatMenu.classList.remove("hidden");
  renderTable();
});

// ====== EXPORT PDF ======
exportPdf.addEventListener("click", () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.text("Riwayat Absen", 10, 10);
  let y = 20;
  dataAbsen.forEach((item) => {
    doc.text(`${item.tanggal} - ${item.keterangan}`, 10, y);
    y += 10;
  });
  doc.save("riwayat_absen.pdf");
});

// ====== EXPORT EXCEL ======
exportExcel.addEventListener("click", () => {
  const ws = XLSX.utils.json_to_sheet(dataAbsen);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Riwayat Absen");
  XLSX.writeFile(wb, "riwayat_absen.xlsx");
});

// ====== CEK STATUS HARI INI ======
(function checkToday() {
  const today = new Date().toLocaleDateString("id-ID");
  const sudahAbsen = dataAbsen.some((x) => x.tanggal === today);
  if (sudahAbsen) {
    absenBtn.classList.add("hidden");
    batalBtn.classList.remove("hidden");
    statusText.textContent = `Sudah absen hari ini (${today})`;
  }
  renderTable();
})();
