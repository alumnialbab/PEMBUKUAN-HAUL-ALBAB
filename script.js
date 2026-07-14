
/* =====================================================
   LPJ HAUL ALUMNI AL ALBAB
   Version : 1.0
   Author  : ChatGPT
=====================================================*/

/* =====================================================
   URL CSV GOOGLE SHEETS
=====================================================*/

const CSV = {

    pengaturan:
        "https://docs.google.com/spreadsheets/d/e/2PACX-1vSPMBOYCmeuRcXWfZdjtGZUGSSOrh6xQH3xpxzTsfiRPz4qjoje_jJpJC0oNch5-_wIeSeMbVmF3Dng/pub?gid=30205368&single=true&output=csv",

    statistik:
        "https://docs.google.com/spreadsheets/d/e/2PACX-1vSPMBOYCmeuRcXWfZdjtGZUGSSOrh6xQH3xpxzTsfiRPz4qjoje_jJpJC0oNch5-_wIeSeMbVmF3Dng/pub?gid=554794101&single=true&output=csv",

    kasMasuk:
        "https://docs.google.com/spreadsheets/d/e/2PACX-1vSPMBOYCmeuRcXWfZdjtGZUGSSOrh6xQH3xpxzTsfiRPz4qjoje_jJpJC0oNch5-_wIeSeMbVmF3Dng/pub?gid=0&single=true&output=csv",

    kasKeluar:
        "https://docs.google.com/spreadsheets/d/e/2PACX-1vSPMBOYCmeuRcXWfZdjtGZUGSSOrh6xQH3xpxzTsfiRPz4qjoje_jJpJC0oNch5-_wIeSeMbVmF3Dng/pub?gid=1232308945&single=true&output=csv"

};

/* =====================================================
   DATA GLOBAL
=====================================================*/

let pengaturan = [];

let statistik = [];

let kasMasuk = [];

let kasKeluar = [];

/* =====================================================
   ELEMENT HTML
=====================================================*/

const loading = document.getElementById("loading");

const toast = document.getElementById("toast");

const toastText = document.getElementById("toastText");

/* =====================================================
   LOADING
=====================================================*/

function showLoading() {

    loading.classList.add("show");

}

function hideLoading() {

    loading.classList.remove("show");

}

/* =====================================================
   TOAST
=====================================================*/

function showToast(text = "Berhasil") {

    toastText.innerText = text;

    toast.classList.add("show");

    setTimeout(() => {

        toast.classList.remove("show");

    }, 2500);

}

/* =====================================================
   FORMAT RUPIAH
=====================================================*/

function rupiah(angka) {

    angka = Number(angka) || 0;

    return new Intl.NumberFormat("id-ID", {

        style: "currency",

        currency: "IDR",

        minimumFractionDigits: 0

    }).format(angka);

}

/* =====================================================
   FORMAT TANGGAL
=====================================================*/

function formatTanggal(tanggal) {

    if (!tanggal) return "-";

    const t = new Date(tanggal);

    if (isNaN(t)) return tanggal;

    return t.toLocaleDateString("id-ID", {

        day: "2-digit",

        month: "long",

        year: "numeric"

    });

}

/* =====================================================
   FORMAT ANGKA
=====================================================*/

function angka(nilai) {

    return Number(String(nilai).replace(/[^\d.-]/g, "")) || 0;

}

/* =====================================================
   FETCH CSV
=====================================================*/

async function getCSV(url) {

    return new Promise((resolve, reject) => {

        Papa.parse(url, {

            download: true,

            header: true,

            skipEmptyLines: true,

            complete: function(result) {

                resolve(result.data);

            },

            error: function(err) {

                reject(err);

            }

        });

    });

}

/* =====================================================
   AMBIL SEMUA DATA
=====================================================*/

async function loadSemuaData() {

    try {

        showLoading();

        const hasil = await Promise.all([

            getCSV(CSV.pengaturan),

            getCSV(CSV.statistik),

            CSV.kasMasuk ? getCSV(CSV.kasMasuk) : Promise.resolve([]),

            CSV.kasKeluar ? getCSV(CSV.kasKeluar) : Promise.resolve([])

        ]);

        pengaturan = hasil[0];

        statistik = hasil[1];

        kasMasuk = hasil[2];

        kasKeluar = hasil[3];

        console.log("Pengaturan :", pengaturan);

        console.log("Statistik :", statistik);

        console.log("Kas Masuk :", kasMasuk);

        console.log("Kas Keluar :", kasKeluar);

        hideLoading();

    } catch (err) {

        console.error(err);

        hideLoading();

        showToast("Gagal memuat data.");

    }

}

/* =====================================================
   REFRESH
=====================================================*/

async function refreshData() {

    await loadSemuaData();

    showToast("Data berhasil diperbarui.");

}

/* =====================================================
   PENGATURAN
=====================================================*/

/**
 * Mengambil nilai dari Sheet Pengaturan
 * Format Sheet:
 * Kolom A = Nama Pengaturan
 * Kolom B = Nilai
 */

function getSetting(nama) {

    if (!pengaturan.length) return "";

    const row = pengaturan.find(item => {

        const key = Object.values(item)[0];

        return key &&
            key.toString().trim().toLowerCase() ===
            nama.toLowerCase();

    });

    if (!row) return "";

    return Object.values(row)[1] || "";

}

/* =====================================================
   HEADER
=====================================================*/

function renderHeader() {

    document.title = getSetting("Nama LPJ");

    document.getElementById("namaLPJ").textContent =
        getSetting("Nama LPJ");

    document.getElementById("subJudul").textContent =
        getSetting("Sub Judul");

    document.getElementById("tahun").textContent =
        getSetting("Tahun");

    document.getElementById("hari").textContent =
        getSetting("Hari");

    document.getElementById("tanggal").textContent =
        getSetting("Tanggal Haul");

    document.getElementById("hijriah").textContent =
        getSetting("Hijriah");

    document.getElementById("tempat").textContent =
        getSetting("Tempat");

}

/* =====================================================
   FOOTER
=====================================================*/

function renderFooter() {

    document.getElementById("bank").textContent =
        getSetting("Bank");

    document.getElementById("rekening").textContent =
        getSetting("No Rekening");

    document.getElementById("atasNama").textContent =
        getSetting("Atas Nama");

    document.getElementById("footerUpdate").textContent =
        getSetting("Update Terakhir");

    document.getElementById("updateTerakhir").textContent =
        getSetting("Update Terakhir");

    document.getElementById("copyrightYear").textContent =
        getSetting("Tahun");

}

/* =====================================================
   STATUS LPJ
=====================================================*/

function renderStatus() {

    const status =
        getSetting("Status LPJ") || "Buka";

    const el1 =
        document.getElementById("statusLPJ");

    const el2 =
        document.getElementById("footerStatus");

    el1.textContent = status;
    el2.textContent = status;

    el1.classList.remove(
        "status-open",
        "status-close"
    );

    el2.classList.remove(
        "status-open",
        "status-close"
    );

    if (status.toLowerCase() === "buka") {

        el1.classList.add("status-open");
        el2.classList.add("status-open");

    } else {

        el1.classList.add("status-close");
        el2.classList.add("status-close");

    }

}

/* =====================================================
   RENDER IDENTITAS WEBSITE
=====================================================*/

function renderPengaturan() {

    renderHeader();

    renderFooter();

    renderStatus();

}

/* =====================================================
   DASHBOARD
=====================================================*/

/**
 * Menghitung Total Pemasukan
 * Hanya metode:
 * - Via Rekening
 * - Cash
 *
 * Belum Diterima tidak dihitung
 */

function hitungDashboard() {

    let totalMasuk = 0;
    let rekening = 0;
    let cash = 0;
    let belum = 0;
    let totalKeluar = 0;

    /* ==========================
       KAS MASUK
    ========================== */

    kasMasuk.forEach(item => {

        const nominal = angka(item["Nominal"]);
        const metode = (item["Metode"] || "").trim().toLowerCase();

        switch (metode) {

            case "via rekening":
            case "rekening":

                rekening += nominal;
                totalMasuk += nominal;

                break;

            case "cash":

                cash += nominal;
                totalMasuk += nominal;

                break;

            case "belum diterima":

                belum += nominal;

                break;
        }

    });

    /* ==========================
       KAS KELUAR
    ========================== */

    kasKeluar.forEach(item => {

        totalKeluar += angka(item["Nominal"]);

    });

    /* ==========================
       SALDO
    ========================== */

    const saldo = totalMasuk - totalKeluar;

    /* ==========================
       TAMPILKAN
    ========================== */

    document.getElementById("totalPemasukan").textContent =
        rupiah(totalMasuk);

    document.getElementById("viaRekening").textContent =
        rupiah(rekening);

    document.getElementById("cash").textContent =
        rupiah(cash);

    document.getElementById("belumDiterima").textContent =
        rupiah(belum);

    document.getElementById("totalPengeluaran").textContent =
        rupiah(totalKeluar);

    document.getElementById("saldoAkhir").textContent =
        rupiah(saldo);

}

/* =====================================================
   WARNA SALDO
=====================================================*/

function updateWarnaSaldo() {

    const saldoText =
        document.getElementById("saldoAkhir").textContent;

    const saldo =
        angka(saldoText);

    const el =
        document.getElementById("saldoAkhir");

    if (saldo >= 0) {

        el.style.color = "#16a34a";

    } else {

        el.style.color = "#dc2626";

    }

}

/* =====================================================
   RENDER DASHBOARD
=====================================================*/

function renderDashboard() {

    hitungDashboard();

    updateWarnaSaldo();

}

/* =====================================================
   BAGIAN 4
   RENDER STATISTIK
=====================================================*/

function renderStatistik() {

    const tbody = document.querySelector("#tableStatistik tbody");

    tbody.innerHTML = "";

    if (!statistik || statistik.length === 0) {

        tbody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align:center;">
                    Data statistik belum tersedia.
                </td>
            </tr>
        `;

        return;

    }

    statistik.forEach((item, index) => {

        const tr = document.createElement("tr");

        tr.innerHTML = `

            <td>${index + 1}</td>

            <td>${item["Kabupaten"] || "-"}</td>

            <td>${rupiah(angka(item["Total Pemasukan"]))}</td>

            <td>${rupiah(angka(item["Via Rekening"]))}</td>

            <td>${rupiah(angka(item["Cash"]))}</td>

            <td>${rupiah(angka(item["Belum Diterima"]))}</td>

            <td>${item["Kontribusi"] || "0%"}</td>

        `;

        tbody.appendChild(tr);

    });

}

/* =====================================================
   UPDATE DASHBOARD DARI SHEET STATISTIK
=====================================================*/

function updateDashboardDariStatistik() {

    let totalPemasukan = 0;
    let viaRekening = 0;
    let cash = 0;
    let belumDiterima = 0;

    statistik.forEach(item => {

        totalPemasukan += angka(item["Total Pemasukan"]);
        viaRekening += angka(item["Via Rekening"]);
        cash += angka(item["Cash"]);
        belumDiterima += angka(item["Belum Diterima"]);

    });

    document.getElementById("totalPemasukan").textContent =
        rupiah(totalPemasukan);

    document.getElementById("viaRekening").textContent =
        rupiah(viaRekening);

    document.getElementById("cash").textContent =
        rupiah(cash);

    document.getElementById("belumDiterima").textContent =
        rupiah(belumDiterima);

}

/* =====================================================
   BAGIAN 5
   KAS MASUK
=====================================================*/

/**
 * Mengurutkan data berdasarkan tanggal terbaru
 */

function sortKasMasuk() {

    kasMasuk.sort((a, b) => {

        return new Date(b["Tanggal"]) - new Date(a["Tanggal"]);

    });

}

/**
 * Render tabel kas masuk
 */

function renderKasMasuk(data = kasMasuk) {

    const tbody = document.getElementById("kasMasukBody");

    tbody.innerHTML = "";

    if (!data.length) {

        tbody.innerHTML = `
            <tr>
                <td colspan="9" style="text-align:center;">
                    Tidak ada data.
                </td>
            </tr>
        `;

        return;

    }

    data.forEach((item, index) => {

        tbody.innerHTML += `

        <tr>

            <td>${index + 1}</td>

            <td>${formatTanggal(item["Tanggal"])}</td>

            <td>${item["Nama Donatur"] || "-"}</td>

            <td>${item["Kabupaten"] || "-"}</td>

            <td>${item["Domisili"] || "-"}</td>

            <td>${rupiah(angka(item["Nominal"]))}</td>

            <td>${item["Metode"] || "-"}</td>

            <td>${item["Via"] || "-"}</td>

            <td>${item["Keterangan"] || "-"}</td>

        </tr>

        `;

    });

}

/**
 * Search realtime
 */

function searchKasMasuk(keyword) {

    keyword = keyword.toLowerCase();

    const hasil = kasMasuk.filter(item => {

        return Object.values(item)

            .join(" ")

            .toLowerCase()

            .includes(keyword);

    });

    renderKasMasuk(hasil);

}

/**
 * Event Search
 */

function initSearchKasMasuk() {

    const input = document.getElementById("searchKasMasuk");

    if (!input) return;

    input.addEventListener("input", function () {

        searchKasMasuk(this.value);

    });

}

/**
 * Inisialisasi Kas Masuk
 */

function initKasMasuk() {

    sortKasMasuk();

    renderKasMasuk();

    initSearchKasMasuk();

}

/* =====================================================
   BAGIAN 6
   KAS KELUAR
=====================================================*/

/**
 * Mengurutkan data berdasarkan tanggal terbaru
 */

function sortKasKeluar() {

    kasKeluar.sort((a, b) => {

        return new Date(b["Tanggal"]) - new Date(a["Tanggal"]);

    });

}

/**
 * Render Tabel Kas Keluar
 */

function renderKasKeluar(data = kasKeluar) {

    const tbody = document.getElementById("kasKeluarBody");

    tbody.innerHTML = "";

    if (!data.length) {

        tbody.innerHTML = `
            <tr>
                <td colspan="8" style="text-align:center;">
                    Tidak ada data.
                </td>
            </tr>
        `;

        return;

    }

    data.forEach((item, index) => {

        tbody.innerHTML += `

        <tr>

            <td>${index + 1}</td>

            <td>${formatTanggal(item["Tanggal"])}</td>

            <td>${item["Keperluan"] || "-"}</td>

            <td>${item["Kategori"] || "-"}</td>

            <td>${item["Penerima"] || "-"}</td>

            <td>${rupiah(angka(item["Nominal"]))}</td>

            <td>${item["Dibayar oleh"] || "-"}</td>

            <td>${item["Keterangan"] || "-"}</td>

        </tr>

        `;

    });

}

/**
 * Search Kas Keluar
 */

function searchKasKeluar(keyword) {

    keyword = keyword.toLowerCase();

    const hasil = kasKeluar.filter(item => {

        return Object.values(item)

            .join(" ")

            .toLowerCase()

            .includes(keyword);

    });

    renderKasKeluar(hasil);

}

/**
 * Event Search
 */

function initSearchKasKeluar() {

    const input =
        document.getElementById("searchKasKeluar");

    if (!input) return;

    input.addEventListener("input", function () {

        searchKasKeluar(this.value);

    });

}

/**
 * Inisialisasi
 */

function initKasKeluar() {

    sortKasKeluar();

    renderKasKeluar();

    initSearchKasKeluar();

}

/* =====================================================
   BAGIAN 7
   NAVIGASI & INISIALISASI
=====================================================*/

/**
 * Menampilkan halaman
 */

function showPage(pageId) {

    document.querySelectorAll(".page").forEach(page => {

        page.style.display = "none";

    });

    const target = document.getElementById(pageId);

    if (target) {

        target.style.display = "block";

    }

}

/**
 * Mengubah tombol aktif
 */

function setActiveButton(button) {

    document.querySelectorAll(".nav-btn").forEach(btn => {

        btn.classList.remove("active");

    });

    button.classList.add("active");

}

/**
 * Event Menu
 */

function initNavigation() {

    const buttons = document.querySelectorAll(".nav-btn");

    buttons.forEach(button => {

        button.addEventListener("click", function () {

            const page = this.dataset.page;

            showPage(page);

            setActiveButton(this);

        });

    });

}

/**
 * Refresh Data Manual
 */

function initRefreshButton() {

    const btn = document.getElementById("btnRefresh");

    if (!btn) return;

    btn.addEventListener("click", async () => {

        btn.disabled = true;

        btn.innerHTML = "Memperbarui...";

        await refreshData();

        btn.disabled = false;

        btn.innerHTML = "Refresh Data";

    });

}

/**
 * Auto Refresh
 * 5 Menit
 */

function autoRefresh() {

    setInterval(async () => {

        await refreshData();

        console.log("Auto Refresh");

    }, 300000);

}

/**
 * Inisialisasi Website
 */

async function initWebsite() {

    showLoading();

    await loadSemuaData();

    showPage("dashboard");

    const firstButton = document.querySelector(".nav-btn");

    if (firstButton) {

        firstButton.classList.add("active");

    }

    initNavigation();

    initRefreshButton();

    autoRefresh();

    hideLoading();

}

/**
 * Jalankan Website
 */

document.addEventListener("DOMContentLoaded", () => {

    initWebsite();

});

/* =====================================================
   BAGIAN 8.1
   EXPORT PDF
=====================================================*/

async function downloadPDF() {

    const { jsPDF } = window.jspdf;

    const pdf = new jsPDF({

        orientation: "portrait",

        unit: "mm",

        format: "a4"

    });

    const pageWidth = pdf.internal.pageSize.getWidth();

    const pageHeight = pdf.internal.pageSize.getHeight();

    /* ==========================================
       COVER
    ========================================== */

    pdf.setFont("helvetica","bold");
    pdf.setFontSize(22);

    pdf.text(
        getSetting("Nama LPJ"),
        pageWidth / 2,
        35,
        { align:"center" }
    );

    pdf.setFontSize(15);

    pdf.text(
        getSetting("Sub Judul"),
        pageWidth / 2,
        46,
        { align:"center" }
    );

    pdf.setFontSize(18);

    pdf.text(
        getSetting("Tahun"),
        pageWidth / 2,
        62,
        { align:"center" }
    );

    pdf.setDrawColor(0);

    pdf.line(35,72,175,72);

    pdf.setFontSize(12);
    pdf.setFont("helvetica","normal");

    pdf.text(
        "Hari",
        30,
        90
    );

    pdf.text(
        ": " + getSetting("Hari"),
        70,
        90
    );

    pdf.text(
        "Tanggal",
        30,
        100
    );

    pdf.text(
        ": " + getSetting("Tanggal Haul"),
        70,
        100
    );

    pdf.text(
        "Hijriah",
        30,
        110
    );

    pdf.text(
        ": " + getSetting("Hijriah"),
        70,
        110
    );

    pdf.text(
        "Tempat",
        30,
        120
    );

    pdf.text(
        ": " + getSetting("Tempat"),
        70,
        120
    );

    pdf.text(
        "Status LPJ",
        30,
        140
    );

    pdf.text(
        ": " + getSetting("Status LPJ"),
        70,
        140
    );

    pdf.text(
        "Update Terakhir",
        30,
        150
    );

    pdf.text(
        ": " + getSetting("Update Terakhir"),
        70,
        150
    );

    pdf.setFontSize(10);

    pdf.text(

        "Website LPJ Haul Alumni AL ALBAB",

        pageWidth/2,

        pageHeight-20,

        {

            align:"center"

        }

    );

    /* ==========================================
       HALAMAN BARU
    ========================================== */

    pdf.addPage();

    pdf.setFont("helvetica","bold");

    pdf.setFontSize(18);

    pdf.text(

        "RINGKASAN KEUANGAN",

        pageWidth/2,

        20,

        {

            align:"center"

        }

    );

    pdf.setFont("helvetica","normal");

    pdf.setFontSize(12);

    let y = 40;

    pdf.text(

        "Total Pemasukan",

        20,

        y

    );

    pdf.text(

        rupiah(
            document
            .getElementById("totalPemasukan")
            .textContent
        ),

        120,

        y

    );

    y += 12;

    pdf.text(

        "Via Rekening",

        20,

        y

    );

    pdf.text(

        document
        .getElementById("viaRekening")
        .textContent,

        120,

        y

    );

    y += 12;

    pdf.text(

        "Cash",

        20,

        y

    );

    pdf.text(

        document
        .getElementById("cash")
        .textContent,

        120,

        y

    );

    y += 12;

    pdf.text(

        "Belum Diterima",

        20,

        y

    );

    pdf.text(

        document
        .getElementById("belumDiterima")
        .textContent,

        120,

        y

    );

    y += 12;

    pdf.text(

        "Total Pengeluaran",

        20,

        y

    );

    pdf.text(

        document
        .getElementById("totalPengeluaran")
        .textContent,

        120,

        y

    );

    y += 12;

    pdf.text(

        "Saldo Akhir",

        20,

        y

    );

    pdf.text(

        document
        .getElementById("saldoAkhir")
        .textContent,

        120,

        y

    );

    /* =================================================
       LANJUT BAGIAN 8.2
    ================================================= */
}

    /* ==========================================
       HALAMAN STATISTIK
    ========================================== */

    pdf.addPage();

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(18);

    pdf.text(
        "STATISTIK PEMASUKAN PER KABUPATEN",
        pageWidth / 2,
        20,
        { align: "center" }
    );

    const statistikTable = [];

    statistik.forEach((item, index) => {

        statistikTable.push([

            index + 1,

            item["Kabupaten"] || "-",

            rupiah(angka(item["Total Pemasukan"])),

            rupiah(angka(item["Via Rekening"])),

            rupiah(angka(item["Cash"])),

            rupiah(angka(item["Belum Diterima"])),

            item["Kontribusi"] || "0%"

        ]);

    });

    pdf.autoTable({

        startY: 30,

        head: [[

            "No",

            "Kabupaten",

            "Total",

            "Rekening",

            "Cash",

            "Belum",

            "Kontribusi"

        ]],

        body: statistikTable,

        theme: "grid",

        styles: {

            fontSize: 9,

            cellPadding: 2,

            valign: "middle"

        },

        headStyles: {

            fillColor: [33, 150, 243],

            textColor: 255,

            halign: "center",

            fontStyle: "bold"

        },

        columnStyles: {

            0: { halign: "center", cellWidth: 10 },

            1: { cellWidth: 45 },

            2: { halign: "right", cellWidth: 32 },

            3: { halign: "right", cellWidth: 28 },

            4: { halign: "right", cellWidth: 25 },

            5: { halign: "right", cellWidth: 30 },

            6: { halign: "center", cellWidth: 22 }

        }

    });

    /* ==========================================
       POSISI AKHIR TABEL
    ========================================== */

    let lastY = pdf.lastAutoTable.finalY + 10;

    pdf.setFontSize(10);

    pdf.text(

        "Total Kabupaten : " + statistik.length,

        14,

        lastY

    );

    /* =================================================
       LANJUT BAGIAN 8.3
    ================================================= */

    /* ==========================================
       HALAMAN KAS MASUK
    ========================================== */

    pdf.addPage();

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(18);

    pdf.text(
        "LAPORAN KAS MASUK",
        pageWidth / 2,
        20,
        { align: "center" }
    );

    const kasMasukTable = [];

    let totalKasMasuk = 0;

    kasMasuk.forEach((item, index) => {

        const nominal = angka(item["Nominal"]);

        totalKasMasuk += nominal;

        kasMasukTable.push([

            index + 1,

            formatTanggal(item["Tanggal"]),

            item["Nama Donatur"] || "-",

            item["Kabupaten"] || "-",

            item["Domisili"] || "-",

            rupiah(nominal),

            item["Metode"] || "-",

            item["Via"] || "-"

        ]);

    });

    pdf.autoTable({

        startY: 30,

        head: [[

            "No",

            "Tanggal",

            "Donatur",

            "Kabupaten",

            "Domisili",

            "Nominal",

            "Metode",

            "Via"

        ]],

        body: kasMasukTable,

        theme: "grid",

        styles: {

            fontSize: 8,

            cellPadding: 2

        },

        headStyles: {

            fillColor: [22,160,133],

            textColor: 255,

            halign: "center"

        },

        columnStyles: {

            0:{cellWidth:10,halign:"center"},

            5:{halign:"right"}

        }

    });

    let akhirKasMasuk = pdf.lastAutoTable.finalY + 8;

    pdf.setFont("helvetica","bold");

    pdf.text(

        "TOTAL PEMASUKAN : " +

        rupiah(totalKasMasuk),

        14,

        akhirKasMasuk

    );

    /* ==========================================
       HALAMAN KAS KELUAR
    ========================================== */

    pdf.addPage();

    pdf.setFont("helvetica","bold");

    pdf.setFontSize(18);

    pdf.text(

        "LAPORAN KAS KELUAR",

        pageWidth/2,

        20,

        {

            align:"center"

        }

    );

    const kasKeluarTable = [];

    let totalKasKeluar = 0;

    kasKeluar.forEach((item,index)=>{

        const nominal = angka(item["Nominal"]);

        totalKasKeluar += nominal;

        kasKeluarTable.push([

            index+1,

            formatTanggal(item["Tanggal"]),

            item["Keperluan"] || "-",

            item["Kategori"] || "-",

            item["Penerima"] || "-",

            rupiah(nominal),

            item["Dibayar oleh"] || "-"

        ]);

    });

    pdf.autoTable({

        startY:30,

        head:[[

            "No",

            "Tanggal",

            "Keperluan",

            "Kategori",

            "Penerima",

            "Nominal",

            "Dibayar Oleh"

        ]],

        body:kasKeluarTable,

        theme:"grid",

        styles:{

            fontSize:8,

            cellPadding:2

        },

        headStyles:{

            fillColor:[220,53,69],

            textColor:255,

            halign:"center"

        },

        columnStyles:{

            0:{cellWidth:10,halign:"center"},

            5:{halign:"right"}

        }

    });

    let akhirKasKeluar = pdf.lastAutoTable.finalY + 8;

    pdf.setFont("helvetica","bold");

    pdf.text(

        "TOTAL PENGELUARAN : " +

        rupiah(totalKasKeluar),

        14,

        akhirKasKeluar

    );

    /* =================================================
       LANJUT BAGIAN 8.4
    ================================================= */

    /* ==========================================
       HALAMAN PENUTUP
    ========================================== */

    pdf.addPage();

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(18);

    pdf.text(
        "PENUTUP",
        pageWidth / 2,
        20,
        { align: "center" }
    );

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(11);

    let y = 40;

    pdf.text(
        "Laporan Pertanggungjawaban ini dibuat secara otomatis",
        20,
        y
    );

    y += 7;

    pdf.text(
        "berdasarkan data yang berasal dari Google Sheets",
        20,
        y
    );

    y += 7;

    pdf.text(
        "dan diperbarui secara realtime.",
        20,
        y
    );

    y += 20;

    pdf.setFont("helvetica", "bold");

    pdf.text("Informasi Rekening",20,y);

    y += 10;

    pdf.setFont("helvetica","normal");

    pdf.text(
        "Bank",
        20,
        y
    );

    pdf.text(
        ": " + getSetting("Bank"),
        60,
        y
    );

    y += 8;

    pdf.text(
        "No Rekening",
        20,
        y
    );

    pdf.text(
        ": " + getSetting("No Rekening"),
        60,
        y
    );

    y += 8;

    pdf.text(
        "Atas Nama",
        20,
        y
    );

    pdf.text(
        ": " + getSetting("Atas Nama"),
        60,
        y
    );

    y += 15;

    pdf.text(
        "Status LPJ",
        20,
        y
    );

    pdf.text(
        ": " + getSetting("Status LPJ"),
        60,
        y
    );

    y += 8;

    pdf.text(
        "Update Terakhir",
        20,
        y
    );

    pdf.text(
        ": " + getSetting("Update Terakhir"),
        60,
        y
    );

    y += 35;

    pdf.text(
        "Mengetahui,",
        30,
        y
    );

    pdf.text(
        "Bendahara",
        140,
        y
    );

    y += 35;

    pdf.line(20,y,70,y);

    pdf.line(130,y,180,y);

    y += 6;

    pdf.text(
        "Ketua Panitia",
        25,
        y
    );

    pdf.text(
        "Bendahara",
        145,
        y
    );

    /* ==========================================
       NOMOR HALAMAN
    ========================================== */

    const totalHalaman = pdf.internal.getNumberOfPages();

    for(let i=1;i<=totalHalaman;i++){

        pdf.setPage(i);

        pdf.setFontSize(9);

        pdf.setTextColor(120);

        pdf.text(

            "Halaman " + i + " dari " + totalHalaman,

            pageWidth/2,

            pageHeight-8,

            {

                align:"center"

            }

        );

    }

    /* ==========================================
       NAMA FILE
    ========================================== */

    const namaLPJ =
        (getSetting("Nama LPJ") || "LPJ")
        .replace(/[^\w\s]/g,"")
        .replace(/\s+/g,"_");

    const tahun =
        getSetting("Tahun") || "";

    pdf.save(

        `${namaLPJ}_${tahun}.pdf`

    );

}
