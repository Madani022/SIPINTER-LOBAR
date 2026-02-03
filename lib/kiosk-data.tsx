import type { MenuItem, SubMenuItem, DocumentItem, SectorItem } from "@/components/kiosk/kiosk-provider"

// --- DATA MENU STATIS DENGAN KONEKSI DB (SLUG) ---
export const menuItems: MenuItem[] = [
  {
    id: "profil",
    title: "Profil DPMPTSP",
    description: "Informasi tentang instansi",
    icon: "Building2", // Ubah jadi String
    submenu: [
      { 
        id: "tentang", 
        title: "Tentang", 
        description: "Ringkasan fungsi dan peran", 
        icon: "Info",
        hasContent: true,
        content: {
          type: "text",
          title: "Tentang DPMPTSP",
          text: "Dinas Penanaman Modal dan Pelayanan Terpadu Satu Pintu sebagai penyelenggara urusan penanaman modal dan pelayanan perizinan di Kabupaten Lombok Barat. Berupaya memberikan pelayanan optimal kepada masyarakat dengan menerapkan sistem pelayanan terpadu secara prima guna memberikan kemudahan, kecepatan, dan transparansi. Sehingga Pelayanan berorientasi pada kepuasan masyarakat pencari izin (Customer Satisfaction)."
        }
      },
      { 
        id: "profil-instansi", 
        title: "Profil DPMPTSP", 
        description: "Alamat, jam layanan, kontak", 
        icon: "Building2",
        hasContent: true,
        content: {
          type: "profile",
          title: "Profil Instansi",
          contactInfo: {
            address: "Jl. TGH. Lopan, Labu Api, Kec. Labuapi, Kabupaten Lombok Barat, Nusa Tenggara Bar. 83362",
            phone: "(0370) 681234",
            email: "dpm_ptsp_lobar@yahoo.com",
            hours: "Senin - Jumat: 08.00 - 15.00 WITA",
            website: "https://dpmptsp.lombokbaratkab.go.id"
          }
        }
      },
      { 
        id: "visi-misi", 
        title: "Visi dan Misi", 
        description: "Visi dan misi instansi", 
        icon: "Target",
        hasContent: true,
        content: {
          type: "points",
          title: "Visi dan Misi",
          points: [
            "VISI: Terwujudnya Pelayanan Perizinan dan Penanaman Modal yang Prima, Transparan, dan Akuntabel",
            "MISI 1: Mensosialisasikan kebijakan Penanaman Modal dan Perizinan kepada masyarakat secara transparan",
            "MISI 2: Memberikan kemudahan dan menjalin kerjasama dibidang investasi sesuai dengan peraturan perundang-undangan yang berlaku.",
            "MISI 3: Memberikan pelayanan investasi dan perizinan sesuai SOP dalam upaya meningkatnya hak-hak masyarakat terhadap pelayanan publik",
            "MISI 4: Meningkatkan sumber daya manusia pelayanan yang profesional."
          ]
        }
      },
      { 
        id: "tupoksi", 
        title: "Tugas dan Fungsi", 
        description: "Tugas pokok dan fungsi", 
        icon: "ListChecks",
        hasContent: true,
        content: {
          type: "points",
          title: "Tugas dan Fungsi",
          points: [
            "Dinas Penanaman Modal dan Pelayanan Terpadu Satu Pintu (DPMPTSP) merupakan unsur pendukung tugas Kepala Daerah, dipimpin oleh Kepala Dinas yang berkedudukan di bawah dan bertanggung jawab kepada Bupati melalui Sekretaris Daerah",
            "Dinas Penanaman Modal dan Pelayanan Terpadu Satu Pintu (DPMPTSP) mempunyai tugas pokok melaksanakan penyusunan dan pelaksanaan kebijakan daerah yang bersifat spesifik di bidang penanaman modal dan pelayanan perizinan",
            "Dalam melaksanakan tugas pokoknya, DPMPTSP menyelenggarakan fungsi perencanaan strategis, perumusan kebijakan teknis, pengelolaan pelayanan dan administrasi perizinan terpadu, koordinasi lintas OPD, serta pembinaan, evaluasi, pelaporan, dan penerbitan izin sesuai ketentuan yang berlaku."
          ]
        }
      },
      { 
        id: "struktur", 
        title: "Struktur Organisasi", 
        description: "Bagan organisasi", 
        icon: "Users",
        // PENTING: Struktur Org biasanya 1 Gambar/PDF.
        // Jika ingin PDF dinamis, ubah jadi hasDocuments: true dan beri categorySlug "struktur"
        hasDocuments: true, 
        categorySlug: "struktur"
      },
      { 
        id: "pejabat", 
        title: "Profil Pejabat Struktural", 
        description: "Daftar pejabat", 
        icon: "UserCircle",
        hasContent: true,
        content: {
          type: "officials",
          title: "Pejabat Struktural",
          officials: [
            { name: "Hery Ramadhan,S.STP.,SH.,M.Si", position: "Kepala Dinas" },
            { name: "Zulyadain,S.Pd", position: "Sekretaris" },
            { name: "Ir. Candra Wijaya, M.T", position: "Kabid. Penanaman Modal" },
            { name: "Hj. Dewi Sartika, S.E., M.M", position: "Kabid. Pelayanan Perizinan" },
            { name: "Eko Prasetyo, S.H., M.H", position: "Kabid. Pengawasan dan Pengendalian" },
            { name: "Fitri Handayani, S.AP., M.AP", position: "Kabid. Data dan Informasi" }
          ]
        }
      },
      { 
        id: "stand-pelayanan", 
        title: "Stand Pelayanan", 
        description: "Video profil pelayanan", 
        icon: "Video",
        hasVideo: true,
        videoUrl: "https://www.youtube.com/embed/9d1cn5yVsJI?si=b7US4Ts8-womqrRH"
      },
    ]
  },
  {
    id: "penanaman-modal",
    title: "Penanaman Modal",
    description: "Informasi investasi",
    icon: "Briefcase",
    submenu: [
      { 
        id: "ipro", 
        title: "IPRO", 
        description: "Investment Project Ready to Offer", 
        icon: "Award",
        hasDocuments: true,
        categorySlug: "ipro" // <--- CONNECT KE DB
      },
      { 
        id: "lkpm", 
        title: "LKPM", 
        description: "Laporan Kegiatan Penanaman Modal", 
        icon: "FileSpreadsheet",
        hasDocuments: true,
        categorySlug: "lkpm" // <--- CONNECT KE DB
      },
    ]
  },
  {
    id: "perizinan",
    title: "Perizinan",
    description: "Layanan perizinan",
    icon: "FileCheck",
    submenu: [
      { 
        id: "sp-sop", 
        title: "SP dan SOP", 
        description: "Standar Pelayanan & SOP", 
        icon: "Shield",
        hasDocuments: true,
        categorySlug: "sop" // <--- CONNECT KE DB
      },
      { 
        id: "layanan-sektor", 
        title: "Jenis Pelayanan / Layanan Sektor", 
        description: "Perizinan berdasarkan sektor", 
        icon: "ClipboardList",
        hasSectors: true
      },
    ]
  },
  {
    id: "tata-ruang",
    title: "Informasi Tata Ruang",
    description: "RDTR dan peta tata ruang",
    icon: "Map",
    submenu: [
      { 
        id: "rdtr-dokumen", 
        title: "Dokumen RDTR", 
        description: "Rencana Detail Tata Ruang", 
        icon: "FileText",
        hasDocuments: true,
        categorySlug: "rdtr-dokumen" // <--- CONNECT KE DB
      },
      { 
        id: "rdtr-interaktif", 
        title: "RDTR Interaktif", 
        description: "Website peta interaktif", 
        icon: "Globe",
        hasContent: true,
        content: {
          type: "text",
          title: "RDTR Interaktif",
          text: "OFFLINE_RDTR"
        }
      },
      { 
        id: "peta-rtrw-qr", 
        title: "Peta RTRW", 
        description: "Website peta tata ruang", 
        icon: "Globe",
        hasContent: true,
        content: {
          type: "text",
          title: "Peta RTRW",
          text: "QR_RTRW"
        }
      },
    ]
  },
  {
    id: "mpp",
    title: "MPP / Informasi Publik",
    description: "Mal Pelayanan Publik",
    icon: "Landmark",
    submenu: [
      { 
        id: "layanan-mpp", 
        title: "Daftar Layanan MPP", 
        description: "Layanan yang tersedia", 
        icon: "Building2",
        hasContent: true,
        content: {
          type: "points",
          title: "Daftar Layanan MPP",
          points: [
            "Layanan Kependudukan (KTP, KK, Akta)",
            "Layanan Perizinan Usaha (OSS, NIB)",
            "Layanan Pertanahan (Sertifikat, IMB)",
            "Layanan Kesehatan (BPJS, Rujukan)",
            "Layanan Ketenagakerjaan (AK1, BPJS TK)",
            "Layanan Pajak Daerah",
            "Layanan Informasi Investasi"
          ]
        }
      },
      {
        id: "regulasi-mpp",
        title: "Regulasi dan Dasar Hukum",
        description: "Dokumen regulasi",
        icon: "Scale",
        hasDocuments: true,
        categorySlug: "regulasi-mpp" // <--- CONNECT KE DB
      },
      { 
        id: "persyaratan-umum", 
        title: "Persyaratan Umum", 
        description: "Dokumen persyaratan", 
        icon: "ScrollText",
        hasDocuments: true,
        categorySlug: "persyaratan-umum" // <--- CONNECT KE DB
      },
      { 
        id: "alur-pelayanan", 
        title: "Alur Pelayanan", 
        description: "Tahapan proses layanan", 
        icon: "BookOpen",
        hasContent: true,
        content: {
          type: "points",
          title: "Alur Pelayanan MPP",
          points: [
            "1. Pengambilan Nomor Antrian di Loket Informasi",
            "2. Verifikasi Kelengkapan Berkas",
            "3. Pengajuan Permohonan di Loket Tujuan",
            "4. Proses Verifikasi dan Validasi Data",
            "5. Pembayaran Retribusi (jika ada)",
            "6. Pengambilan Dokumen di Loket Pengambilan"
          ]
        }
      },
      { 
        id: "kontak-lokasi", 
        title: "Informasi Kontak & Lokasi", 
        description: "Alamat dan kontak MPP", 
        icon: "Phone",
        hasContent: true,
        content: {
          type: "profile",
          title: "Kontak & Lokasi MPP",
          contactInfo: {
            address: "Gedung MPP Lombok Barat, Jl. Soekarno Hatta No. 2, Giri Menang, Gerung",
            phone: "(0370) 681234 / 681235",
            email: "mpp@lombokbaratkab.go.id",
            hours: "Senin - Kamis: 08.00 - 15.00 WITA, Jumat: 08.00 - 14.00 WITA"
          }
        }
      },
    ]
  },
  {
    id: "peta-potensi",
    title: "SIPETA LOBAR",
    description: "Scan QR untuk melihat peta",
    icon: "QrCode",
    isQrCode: true,
    qrUrl: "https://potensi.lombokbaratkab.go.id",
    qrDescription: "Sistem Informasi Pemetaan Lokasi dan Rekomendasi Usaha Lombok Barat. Scan QR Code untuk mengakses peta interaktif di smartphone Anda."
  },
]

export const sectors: SectorItem[] = [
  { id: "industri-perdagangan", title: "Industri dan Perdagangan", description: "Perizinan sektor industri", icon: "Factory" },
  { id: "kesehatan", title: "Kesehatan", description: "Perizinan sektor kesehatan", icon: "HeartPulse" },
  { id: "lingkungan", title: "Lingkungan", description: "Perizinan lingkungan hidup", icon: "Leaf" },
  { id: "putr", title: "PUTR", description: "Pekerjaan Umum & Tata Ruang", icon: "Building" },
  { id: "perhubungan", title: "Perhubungan", description: "Perizinan transportasi", icon: "Bus" },
  { id: "pariwisata", title: "Pariwisata", description: "Perizinan pariwisata", icon: "Palmtree" },
  { id: "koperasi", title: "Koperasi", description: "Perizinan koperasi & UKM", icon: "Users2" },
  { id: "tenaga-kerja", title: "Tenaga Kerja", description: "Perizinan ketenagakerjaan", icon: "HardHat" },
  { id: "kelautan-perikanan", title: "Kelautan dan Perikanan", description: "Perizinan kelautan", icon: "Fish" },
  { id: "pertanian-pangan", title: "Pertanian dan Pangan", description: "Perizinan pertanian", icon: "Wheat" },
  { id: "pendidikan-kebudayaan", title: "Pendidikan dan Kebudayaan", description: "Perizinan pendidikan", icon: "GraduationCap" },
  { id: "bpjs-ketenagakerjaan", title: "BPJS Ketenagakerjaan", description: "Layanan BPJS TK", icon: "BadgeCheck" },
]

// --- DATA DOCUMENTS KITA KOSONGKAN ---
// Karena sekarang data ini diambil LIVE dari Database via Server Action.
export const documents: Record<string, DocumentItem[]> = {}

// --- HELPER FUNCTIONS ---
export function getMenuById(id: string): MenuItem | undefined {
  return menuItems.find(item => item.id === id)
}

export function getSubmenuById(menuId: string, submenuId: string): SubMenuItem | undefined {
  const menu = getMenuById(menuId)
  return menu?.submenu?.find(item => item.id === submenuId)
}

export function getSectors(): SectorItem[] {
  return sectors
}

export function getSectorById(sectorId: string): SectorItem | undefined {
  return sectors.find(s => s.id === sectorId)
}

// Fallback untuk kode lama, return kosong agar tidak error
export function getDocuments(categoryId: string): DocumentItem[] {
  return []
}