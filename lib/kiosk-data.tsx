import type { MenuItem, SubMenuItem, DocumentItem, SectorItem } from "@/components/kiosk/kiosk-provider"

// --- DATA MENU UTAMA (STATIS) ---
export const menuItems: MenuItem[] = [
  {
    id: "profil",
    title: "Profil DPMPTSP",
    description: "Informasi tentang instansi",
    icon: "Building2",
    submenu: [
      { 
        id: "tentang", 
        title: "Tentang", 
        description: "Ringkasan fungsi dan peran", 
        icon: "Info",
        hasContent: true,
        content: {
          type: "profile",
          title: "Tentang DPMPTSP",
          imageUrl: "/logoSipinterLobar.png",
          text: "Dinas Penanaman Modal dan Pelayanan Terpadu Satu Pintu sebagai penyelenggara urusan penanaman modal dan pelayanan perizinan di Kabupaten Lombok Barat. Berupaya memberikan pelayanan optimal kepada masyarakat dengan menerapkan sistem pelayanan terpadu secara prima guna memberikan kemudahan, kecepatan, dan transparansi. Sehingga Pelayanan berorientasi pada kepuasan masyarakat pencari izin (Customer Satisfaction)."
        }
      },
      { 
        id: "profil-instansi", 
        title: "Profil Instansi", 
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
        hasContent: true, 
        content: {
          type: "image", 
          title: "Struktur Organisasi",
          imageUrl: "/struktur-organisasi-fix.png"
        }
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
        categorySlug: "ipro"
      },
      { 
        id: "lkpm", 
        title: "LKPM", 
        description: "Laporan Kegiatan Penanaman Modal", 
        icon: "FileSpreadsheet",
        hasDocuments: true,
        categorySlug: "lkpm"
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
        categorySlug: "sop"
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
        categorySlug: "rdtr-dokumen"
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
            "Industri dan Perdagangan (Disperindag)",
            "Kesehatan (Dikes)",
            "Lingkungan Hidup (Dinas LH)",
            "Dinas PUTR",
            "Perhubungan (Dishub)",
            "Pariwisata (Dispar)",
            "Koperasi (Diskop)",
            "Tenaga Kerja (Disnaker)",
            "Kelautan dan Perikanan (Dislutkan)",
            "Pertanian dan Pangan (DKPP)",
            "Pendidikan dan Kebudayaan (Dikbud)",
            "BPJS Ketenagakerjaan (BPJS TK)"
          ]
        }
      },
      {
        id: "regulasi-mpp",
        title: "Regulasi dan Dasar Hukum",
        description: "Dokumen regulasi",
        icon: "Scale",
        hasDocuments: true,
        categorySlug: "regulasi-mpp"
      },
      { 
        id: "persyaratan-umum", 
        title: "Persyaratan Umum", 
        description: "Dokumen persyaratan", 
        icon: "ScrollText",
        hasDocuments: true,
        categorySlug: "persyaratan-umum"
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
            "Pengambilan Nomor Antrian di Loket Informasi",
            "Verifikasi Kelengkapan Berkas",
            "Pengajuan Permohonan di Loket Tujuan",
            "Proses Verifikasi dan Validasi Data",
            "Pembayaran Retribusi (jika ada)",
            "Pengambilan Dokumen di Loket Pengambilan"
          ]
        }
      },
      // { 
      //   id: "kontak-lokasi", 
      //   title: "Informasi Kontak & Lokasi", 
      //   description: "Alamat dan kontak MPP", 
      //   icon: "Phone",
      //   hasContent: true,
      //   content: {
      //     type: "profile",
      //     title: "Kontak & Lokasi MPP",
      //     contactInfo: {
      //       address: "Gedung MPP Lombok Barat, Jl. Soekarno Hatta No. 2, Giri Menang, Gerung",
      //       phone: "(0370) 681234 / 681235",
      //       email: "mpp@lombokbaratkab.go.id",
      //       hours: "Senin - Kamis: 08.00 - 15.00 WITA, Jumat: 08.00 - 14.00 WITA"
      //     }
      //   }
      // },
    ]
  },
  {
    id: "peta-potensi",
    title: "SIPETA LOBAR",
    description: "Scan QR untuk melihat peta",
    icon: "QrCode",
    isQrCode: true,
    qrUrl: "https://sipeta-lobar.vercel.app",
    qrDescription: "Sistem Informasi Pemetaan Lokasi dan Rekomendasi Usaha Lombok Barat. Scan QR Code untuk mengakses peta interaktif di smartphone Anda."
  },
]

// --- DATA SECTORS (UPDATED DENGAN SLUG) ---
// Pastikan kamu membuat Kategori di Database dengan slug yang sama persis!
export const sectors: SectorItem[] = [
  { 
    id: "industri-perdagangan", 
    title: "Industri dan Perdagangan", 
    description: "Perizinan sektor industri", 
    icon: "Factory",
    categorySlug: "sektor-industri" // <--- CONNECT DB
  },
  { 
    id: "kesehatan", 
    title: "Kesehatan", 
    description: "Perizinan sektor kesehatan", 
    icon: "HeartPulse",
    categorySlug: "sektor-kesehatan"
  },
  { 
    id: "lingkungan", 
    title: "Lingkungan", 
    description: "Perizinan lingkungan hidup", 
    icon: "Leaf",
    categorySlug: "sektor-lingkungan"
  },
  { 
    id: "putr", 
    title: "PUTR", 
    description: "Pekerjaan Umum & Tata Ruang", 
    icon: "Building",
    categorySlug: "sektor-putr"
  },
  { 
    id: "perhubungan", 
    title: "Perhubungan", 
    description: "Perizinan transportasi", 
    icon: "Bus",
    categorySlug: "sektor-perhubungan"
  },
  { 
    id: "pariwisata", 
    title: "Pariwisata", 
    description: "Perizinan pariwisata", 
    icon: "Palmtree",
    categorySlug: "sektor-pariwisata"
  },
  { 
    id: "koperasi", 
    title: "Koperasi", 
    description: "Perizinan koperasi & UKM", 
    icon: "Users2",
    categorySlug: "sektor-koperasi"
  },
  { 
    id: "tenaga-kerja", 
    title: "Tenaga Kerja", 
    description: "Perizinan ketenagakerjaan", 
    icon: "HardHat",
    categorySlug: "sektor-naker"
  },
  { 
    id: "kelautan-perikanan", 
    title: "Kelautan dan Perikanan", 
    description: "Perizinan kelautan", 
    icon: "Fish",
    categorySlug: "sektor-perikanan"
  },
  { 
    id: "pertanian-pangan", 
    title: "Pertanian dan Pangan", 
    description: "Perizinan pertanian", 
    icon: "Wheat",
    categorySlug: "sektor-pertanian"
  },
  { 
    id: "pendidikan-kebudayaan", 
    title: "Pendidikan dan Kebudayaan", 
    description: "Perizinan pendidikan", 
    icon: "GraduationCap",
    categorySlug: "sektor-pendidikan"
  },
  { 
    id: "bpjs-ketenagakerjaan", 
    title: "BPJS Ketenagakerjaan", 
    description: "Layanan BPJS TK", 
    icon: "BadgeCheck",
    categorySlug: "sektor-bpjs"
  },
]

// --- HELPER FUNCTIONS ---
export const documents: Record<string, DocumentItem[]> = {}

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

export function getDocuments(categoryId: string): DocumentItem[] {
  return []
}