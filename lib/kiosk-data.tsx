import { 
  Building2, FileText, Landmark, Users, QrCode, Briefcase, 
  ClipboardList, Award, ScrollText, BookOpen, FileCheck, 
  Shield, MapPin, Video, Target, ListChecks, UserCircle,
  Factory, HeartPulse, Leaf, Building, Bus, Palmtree,
  Users2, HardHat, Fish, Wheat, GraduationCap, BadgeCheck,
  Map, Globe, Phone, FileSpreadsheet, Info
} from "lucide-react"
import type { MenuItem, SubMenuItem, DocumentItem, SectorItem, ContentData } from "@/components/kiosk/kiosk-provider"

export const menuItems: MenuItem[] = [
  {
    id: "profil",
    title: "Profil DPMPTSP",
    description: "Informasi tentang instansi",
    icon: <Building2 className="h-12 w-12" />,
    submenu: [
      { 
        id: "tentang", 
        title: "Tentang", 
        description: "Ringkasan fungsi dan peran", 
        icon: <Info className="h-10 w-10" />,
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
        icon: <Building2 className="h-10 w-10" />,
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
        icon: <Target className="h-10 w-10" />,
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
        icon: <ListChecks className="h-10 w-10" />,
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
        icon: <Users className="h-10 w-10" />,
        hasContent: true, 
        content: {
          type: "image", 
          title: "Struktur Organisasi DPMPTSP",
          imageUrl: "/struktur-organisasi-fix.png", // Pastikan nama file ini sesuai
          alt: "Bagan Struktur Organisasi"
        }
      },
      { 
        id: "pejabat", 
        title: "Profil Pejabat Struktural", 
        description: "Daftar pejabat", 
        icon: <UserCircle className="h-10 w-10" />,
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
        icon: <Video className="h-10 w-10" />,
        hasVideo: true,
        videoUrl: "https://www.youtube.com/embed/9d1cn5yVsJI?si=b7US4Ts8-womqrRH"
      },
    ]
  },
  {
    id: "penanaman-modal",
    title: "Penanaman Modal",
    description: "Informasi investasi",
    icon: <Briefcase className="h-12 w-12" />,
    submenu: [
      { 
        id: "ipro", 
        title: "IPRO", 
        description: "Investment Project Ready to Offer", 
        icon: <Award className="h-10 w-10" />,
        hasDocuments: true
      },
      { 
        id: "lkpm", 
        title: "LKPM", 
        description: "Laporan Kegiatan Penanaman Modal", 
        icon: <FileSpreadsheet className="h-10 w-10" />,
        hasDocuments: true
      },
    ]
  },
  {
    id: "perizinan",
    title: "Perizinan",
    description: "Layanan perizinan",
    icon: <FileCheck className="h-12 w-12" />,
    submenu: [
      { 
        id: "sp-sop", 
        title: "SP dan SOP", 
        description: "Standar Pelayanan & SOP", 
        icon: <Shield className="h-10 w-10" />,
        hasDocuments: true
      },
      { 
        id: "layanan-sektor", 
        title: "Jenis Pelayanan / Layanan Sektor", 
        description: "Perizinan berdasarkan sektor", 
        icon: <ClipboardList className="h-10 w-10" />,
        hasSectors: true
      },
    ]
  },
  {
    id: "tata-ruang",
    title: "Informasi Tata Ruang",
    description: "RDTR dan peta tata ruang",
    icon: <Map className="h-12 w-12" />,
    submenu: [
      { 
        id: "rdtr-dokumen", 
        title: "Dokumen RDTR", 
        description: "Rencana Detail Tata Ruang", 
        icon: <FileText className="h-10 w-10" />,
        hasDocuments: true
      },
      { 
        id: "rdtr-interaktif", 
        title: "RDTR Interaktif", 
        description: "Website peta interaktif", 
        icon: <Globe className="h-10 w-10" />,
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
        icon: <Globe className="h-10 w-10" />,
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
    icon: <Landmark className="h-12 w-12" />,
    submenu: [
      { 
        id: "layanan-mpp", 
        title: "Daftar Layanan MPP", 
        description: "Layanan yang tersedia", 
        icon: <Building2 className="h-10 w-10" />,
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
        id: "persyaratan-umum", 
        title: "Persyaratan Umum", 
        description: "Dokumen persyaratan", 
        icon: <ScrollText className="h-10 w-10" />,
        hasDocuments: true
      },
      { 
        id: "alur-pelayanan", 
        title: "Alur Pelayanan", 
        description: "Tahapan proses layanan", 
        icon: <BookOpen className="h-10 w-10" />,
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
        icon: <Phone className="h-10 w-10" />,
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
    icon: <QrCode className="h-12 w-12" />,
    isQrCode: true,
    qrUrl: "https://potensi.lombokbaratkab.go.id",
    qrDescription: "Sistem Informasi Pemetaan Lokasi dan Rekomendasi Usaha Lombok Barat. Scan QR Code untuk mengakses peta interaktif di smartphone Anda."
  },
]

export const sectors: SectorItem[] = [
  { id: "industri-perdagangan", title: "Industri dan Perdagangan", description: "Perizinan sektor industri", icon: <Factory className="h-10 w-10" /> },
  { id: "kesehatan", title: "Kesehatan", description: "Perizinan sektor kesehatan", icon: <HeartPulse className="h-10 w-10" /> },
  { id: "lingkungan", title: "Lingkungan", description: "Perizinan lingkungan hidup", icon: <Leaf className="h-10 w-10" /> },
  { id: "putr", title: "PUTR", description: "Pekerjaan Umum & Tata Ruang", icon: <Building className="h-10 w-10" /> },
  { id: "perhubungan", title: "Perhubungan", description: "Perizinan transportasi", icon: <Bus className="h-10 w-10" /> },
  { id: "pariwisata", title: "Pariwisata", description: "Perizinan pariwisata", icon: <Palmtree className="h-10 w-10" /> },
  { id: "koperasi", title: "Koperasi", description: "Perizinan koperasi & UKM", icon: <Users2 className="h-10 w-10" /> },
  { id: "tenaga-kerja", title: "Tenaga Kerja", description: "Perizinan ketenagakerjaan", icon: <HardHat className="h-10 w-10" /> },
  { id: "kelautan-perikanan", title: "Kelautan dan Perikanan", description: "Perizinan kelautan", icon: <Fish className="h-10 w-10" /> },
  { id: "pertanian-pangan", title: "Pertanian dan Pangan", description: "Perizinan pertanian", icon: <Wheat className="h-10 w-10" /> },
  { id: "pendidikan-kebudayaan", title: "Pendidikan dan Kebudayaan", description: "Perizinan pendidikan", icon: <GraduationCap className="h-10 w-10" /> },
  { id: "bpjs-ketenagakerjaan", title: "BPJS Ketenagakerjaan", description: "Layanan BPJS TK", icon: <BadgeCheck className="h-10 w-10" /> },
]

export const documents: Record<string, DocumentItem[]> = {
  "struktur": [
    { id: "struktur-org", title: "Struktur Organisasi DPMPTSP", description: "Bagan struktur", pdfUrl: "/docs/struktur.pdf" },
  ],
  "ipro": [
    { id: "ipro-giligede", title: "IPRO Gili Gede 2022", description: "Investment Project Ready to Offer", pdfUrl: "/docs/ipro.pdf" },
    { id: "ipro-pariwisata", title: "IPRO Sektor Pariwisata", description: "Proyek investasi pariwisata", pdfUrl: "/docs/ipro-pariwisata.pdf" },
    { id: "ipro-industri", title: "IPRO Sektor Industri", description: "Proyek investasi industri", pdfUrl: "/docs/ipro-industri.pdf" },
    { id: "ipro-pertanian", title: "IPRO Sektor Pertanian", description: "Proyek investasi pertanian", pdfUrl: "/docs/ipro-pertanian.pdf" },
  ],
  "lkpm": [
    { id: "panduan-lkpm", title: "Panduan Pengisian LKPM", description: "Tata cara pengisian", pdfUrl: "/docs/LKPM.pdf" }
    // { id: "format-lkpm", title: "Format LKPM", description: "Template laporan", pdfUrl: "/docs/format-lkpm.pdf" },
    // { id: "regulasi-lkpm", title: "Regulasi LKPM", description: "Peraturan terkait", pdfUrl: "/docs/regulasi-lkpm.pdf" },
  ],
  "sp-sop": [
    { id: "sop-sicantik", title: "SOP SiCANTIK", description: "SOP Sicantik", pdfUrl: "/docs/SOP-SiCANTIK.pdf" },
    { id: "sop-pbg", title: "SOP PBG", description: "SOP PBG", pdfUrl: "/docs/SOP-PBG-DPMPTSP.pdf" },
    { id: "sp-putr", title: "SOP PUTR", description: "SOP PUTR", pdfUrl: "/docs/SOP-putr.pdf" },
    { id: "sp-sop-bappenda", title: "SP dan SOP Bappenda", description: "Alur SOP Bappenda", pdfUrl: "/docs/SP-DAN-SOP-alur-bapenda.pdf" },
    { id: "sp-sop-dikes", title: "SP dan SOP Dikes", description: "Alur SOP Dikes", pdfUrl: "/docs/SP-DAN-SOP-alur-dikes.pdf" },
    { id: "sp-sop-dishub", title: "SP dan SOP Dishub", description: "Alur SOP Dishub", pdfUrl: "/docs/SP-DAN-SOP-alur-dishub.pdf" },
    { id: "sp-sop-diskominfotik", title: "SP dan SOP Diskominfotik", description: "Alur SOP Diskominfotik", pdfUrl: "/docs/SP-DAN-SOP-alur-diskominfotik.pdf" },
    { id: "sp-sop-diskop", title: "SP dan SOP Diskop", description: "Alur SOP Diskop", pdfUrl: "/docs/SP-DAN-SOP-alur-diskop.pdf" },
    { id: "sp-sop-dislutkan", title: "SP dan SOP Dislutkan", description: "Alur SOP Dislutkan", pdfUrl: "/docs/SP-DAN-SOP-alur-dislutkan.pdf" },
    { id: "sp-sop-disnaker", title: "SP dan SOP Disnaker", description: "Alur SOP Disnaker", pdfUrl: "/docs/SP-DAN-SOP-alur-disnaker.pdf" },
    { id: "sp-sop-disperindag", title: "SP dan SOP Disperindag", description: "Alur SOP Disperindag", pdfUrl: "/docs/SP-DAN-SOP-alur-disperindag.pdf" },
    { id: "sp-sop-lingkunganHidup", title: "SP dan SOP Lingkungan Hidup", description: "Alur SOP Lingkungan Hidup", pdfUrl: "/docs/SP-DAN-SOP-alur-LH.pdf" },
    { id: "sp-sop-pangan", title: "SP dan SOP Dikpangan", description: "Alur SOP Dikpangan", pdfUrl: "/docs/SP-DAN-SOP-alur-pangan.pdf" },
    { id: "sp-sop-perkim", title: "SP dan SOP Perkim", description: "Alur SOP Perkim", pdfUrl: "/docs/SP-DAN-SOP-alur-perkim.pdf" },
    { id: "sp-sop-pertanian", title: "SP dan SOP Pertanian", description: "Alur SOP Pertanian", pdfUrl: "/docs/SP-DAN-SOP-alur-pertanian.pdf" },
    { id: "sp-sop-dpmptsp", title: "SP dan SOP DPMPTSP", description: "SOP DPMPTSP", pdfUrl: "/docs/SP-DAN-SOP-DPMPTSP.pdf" },
  ],
  "rdtr-dokumen": [
    { id: "rdtr-gerung", title: "RDTR Kawasan Gerung", description: "Rencana detail", pdfUrl: "/docs/rdtr-gerung.pdf" },
    { id: "rdtr-sekotong", title: "RDTR Kawasan Lembar", description: "Rencana detail", pdfUrl: "/docs/rdtr-lembar.pdf" },
    { id: "rdtr-senggigi", title: "RDTR Kawasan Senggigi", description: "Rencana detail", pdfUrl: "/docs/RDTR-senggigi-batulayar.pdf" },
    // { id: "peta-rtrw", title: "Peta RTRW Lombok Barat", description: "Peta tata ruang", pdfUrl: "/docs/peta-rtrw.pdf" },
  ],
  "persyaratan-umum": [
    { id: "syarat-umum", title: "Persyaratan Umum Perizinan", description: "Dokumen wajib", pdfUrl: "/docs/syarat-umum.pdf" },
    { id: "syarat-badan-usaha", title: "Persyaratan Badan Usaha", description: "Syarat perusahaan", pdfUrl: "/docs/syarat-badan-usaha.pdf" },
    { id: "syarat-perorangan", title: "Persyaratan Perorangan", description: "Syarat individu", pdfUrl: "/docs/syarat-perorangan.pdf" },
  ],
  // Sector documents
  "industri-perdagangan": [
    { id: "izin-industri", title: "Izin Usaha Industri", description: "IUI/SIUP", pdfUrl: "/docs/izin-industri.pdf" },
    { id: "tanda-daftar", title: "Tanda Daftar Perusahaan", description: "TDP", pdfUrl: "/docs/tdp.pdf" },
  ],
  "kesehatan": [
    { id: "izin-klinik", title: "Izin Operasional Klinik", description: "Persyaratan klinik", pdfUrl: "/docs/izin-klinik.pdf" },
    { id: "izin-apotek", title: "Izin Apotek", description: "Persyaratan apotek", pdfUrl: "/docs/izin-apotek.pdf" },
    { id: "izin-praktek", title: "Surat Izin Praktek", description: "SIP tenaga kesehatan", pdfUrl: "/docs/sip.pdf" },
  ],
  "lingkungan": [
    { id: "izin-lingkungan", title: "Izin Lingkungan", description: "AMDAL/UKL-UPL", pdfUrl: "/docs/izin-lingkungan.pdf" },
    { id: "izin-limbah", title: "Izin Pengelolaan Limbah", description: "Izin B3", pdfUrl: "/docs/izin-limbah.pdf" },
  ],
  "putr": [
    { id: "imb", title: "Izin Mendirikan Bangunan", description: "IMB/PBG", pdfUrl: "/docs/imb.pdf" },
    { id: "slf", title: "Sertifikat Laik Fungsi", description: "SLF bangunan", pdfUrl: "/docs/slf.pdf" },
  ],
  "perhubungan": [
    { id: "izin-trayek", title: "Izin Trayek", description: "Angkutan umum", pdfUrl: "/docs/izin-trayek.pdf" },
    { id: "izin-parkir", title: "Izin Pengelolaan Parkir", description: "Perparkiran", pdfUrl: "/docs/izin-parkir.pdf" },
  ],
  "pariwisata": [
    { id: "tdup", title: "TDUP", description: "Tanda Daftar Usaha Pariwisata", pdfUrl: "/docs/tdup.pdf" },
    { id: "izin-hotel", title: "Izin Usaha Hotel", description: "Akomodasi", pdfUrl: "/docs/izin-hotel.pdf" },
    { id: "izin-restoran", title: "Izin Usaha Restoran", description: "Rumah makan", pdfUrl: "/docs/izin-restoran.pdf" },
  ],
  "koperasi": [
    { id: "izin-koperasi", title: "Pengesahan Akta Koperasi", description: "Badan hukum", pdfUrl: "/docs/izin-koperasi.pdf" },
    { id: "izin-ukm", title: "Izin Usaha Mikro Kecil", description: "IUMK", pdfUrl: "/docs/iumk.pdf" },
  ],
  "tenaga-kerja": [
    { id: "izin-lptks", title: "Izin LPTKS", description: "Lembaga pelatihan", pdfUrl: "/docs/izin-lptks.pdf" },
    { id: "ak1", title: "Kartu AK1", description: "Pencari kerja", pdfUrl: "/docs/ak1.pdf" },
  ],
  "kelautan-perikanan": [
    { id: "siup-perikanan", title: "SIUP Perikanan", description: "Usaha perikanan", pdfUrl: "/docs/siup-perikanan.pdf" },
    { id: "sipi", title: "SIPI", description: "Izin penangkapan ikan", pdfUrl: "/docs/sipi.pdf" },
  ],
  "pertanian-pangan": [
    { id: "izin-usaha-pertanian", title: "Izin Usaha Pertanian", description: "Budidaya tanaman", pdfUrl: "/docs/izin-pertanian.pdf" },
    { id: "izin-pangan", title: "Izin Edar Pangan", description: "Produk pangan", pdfUrl: "/docs/izin-pangan.pdf" },
  ],
  "pendidikan-kebudayaan": [
    { id: "izin-sekolah", title: "Izin Operasional Sekolah", description: "Lembaga pendidikan", pdfUrl: "/docs/izin-sekolah.pdf" },
    { id: "izin-kursus", title: "Izin Lembaga Kursus", description: "LPK", pdfUrl: "/docs/izin-kursus.pdf" },
  ],
  "bpjs-ketenagakerjaan": [
    { id: "panduan-bpjs", title: "Panduan Pendaftaran BPJS TK", description: "Tata cara", pdfUrl: "/docs/panduan-bpjs.pdf" },
    { id: "form-bpjs", title: "Formulir BPJS TK", description: "Form pendaftaran", pdfUrl: "/docs/form-bpjs.pdf" },
  ],
}

export function getMenuById(id: string): MenuItem | undefined {
  return menuItems.find(item => item.id === id)
}

export function getSubmenuById(menuId: string, submenuId: string): SubMenuItem | undefined {
  const menu = getMenuById(menuId)
  return menu?.submenu?.find(item => item.id === submenuId)
}

export function getDocuments(categoryId: string): DocumentItem[] {
  return documents[categoryId] || []
}

export function getSectors(): SectorItem[] {
  return sectors
}

export function getSectorById(sectorId: string): SectorItem | undefined {
  return sectors.find(s => s.id === sectorId)
}
