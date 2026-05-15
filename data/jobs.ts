/* ─── Job Data Types ─── */
export interface JobDetail {
  id: number;
  title: string;
  company: string;
  verified: boolean;
  type: string;
  typeColor: string;
  location: string;
  locationDetail: string;
  workMode: string;
  experience: string;
  experienceLevel: string;
  salary: string;
  salaryDetail: string;
  logoColor: string;
  logoText: string;
  logoBg: string;
  activeTime: string;
  postedDate: string;
  deadline: string;

  /* Detail page content */
  tagline: string;
  aboutRole: string[];
  responsibilities: string[];
  requirements: string[];
  benefits: string[];

  /* Company info */
  companyDescription: string;
  companyTags: string[];
  companySize: string;

  /* Gallery images */
  galleryImages: { src: string; alt: string }[];
}

/* ─── Backward-compatible export for JobCard ─── */
export interface JobCardData {
  id: number;
  title: string;
  company: string;
  verified: boolean;
  type: string;
  typeColor: string;
  location: string;
  experience: string;
  salary: string;
  logoColor: string;
  logoText: string;
  logoBg: string;
  activeTime: string;
}

/* ─── Full Job Data ─── */
export const jobs: JobDetail[] = [
  {
    id: 1,
    title: "Marketing Technology",
    company: "PFI Mega Life",
    verified: true,
    type: "Kontrak",
    typeColor: "#3B82F6",
    location: "On-site • Jakarta Selatan",
    locationDetail: "Jakarta Selatan",
    workMode: "On-site (5 hari di kantor)",
    experience: "Min. 1-3 Years Experience",
    experienceLevel: "Mid-Level (1-3 thn)",
    salary: "Negotiable",
    salaryDetail: "Negotiable",
    logoColor: "#1E40AF",
    logoText: "PFI",
    logoBg: "#E0E7FF",
    activeTime: "1h lalu",
    postedDate: "2 hari lalu",
    deadline: "31 Oktober",
    tagline:
      "Bergabunglah dalam tim Marketing Technology kami untuk mengembangkan dan mengelola platform teknologi pemasaran yang inovatif.",
    aboutRole: [
      "Di PFI Mega Life, kami percaya bahwa teknologi pemasaran yang tepat dapat membuat perbedaan besar bagi perusahaan asuransi modern. Kami mencari Marketing Technologist berpengalaman untuk memimpin implementasi dan optimalisasi MarTech stack kami.",
      "Dalam peran ini, Anda akan menjadi penghubung antara tim pemasaran dan teknologi, memastikan bahwa setiap kampanye didukung oleh infrastruktur data yang kuat dan efisien.",
    ],
    responsibilities: [
      "Mengelola dan mengoptimalkan MarTech stack perusahaan termasuk CRM, marketing automation, dan analytics platform.",
      "Berkolaborasi dengan tim kreatif dan data untuk mengembangkan kampanye digital berbasis data.",
      "Membangun dashboard pelaporan dan sistem tracking untuk mengukur efektivitas kampanye.",
      "Mengembangkan strategi integrasi data antar platform untuk customer journey yang seamless.",
    ],
    requirements: [
      "Pengalaman 1-3 tahun di bidang marketing technology atau digital marketing.",
      "Familiar dengan marketing automation tools (HubSpot, Salesforce Marketing Cloud, atau sejenisnya).",
      "Pemahaman tentang data analytics dan kemampuan membaca insight dari data kampanye.",
      "Kemampuan komunikasi yang baik untuk berkoordinasi dengan berbagai tim.",
    ],
    benefits: ["BPJS", "Asuransi Kesehatan", "Bonus Kinerja", "Work-Life Balance"],
    companyDescription:
      "PFI Mega Life adalah perusahaan asuransi jiwa yang berfokus pada inovasi digital. Kami berkomitmen untuk memberikan perlindungan terbaik dengan teknologi modern.",
    companyTags: ["Asuransi", "Fintech"],
    companySize: "500-1000 Karyawan",
    galleryImages: [
      { src: "/assets/workspace.png", alt: "Workspace PFI Mega Life" },
      { src: "/assets/design-tool.png", alt: "Tools yang digunakan" },
    ],
  },
  {
    id: 2,
    title: "Sales Counter - PIK",
    company: "Allure Industries",
    verified: true,
    type: "Kontrak",
    typeColor: "#3B82F6",
    location: "On-site • Jakarta Utara",
    locationDetail: "Jakarta Utara",
    workMode: "On-site (6 hari di kantor)",
    experience: "Min. SMA/K",
    experienceLevel: "Entry Level",
    salary: "Negotiable",
    salaryDetail: "Negotiable",
    logoColor: "#065F46",
    logoText: "AI",
    logoBg: "#D1FAE5",
    activeTime: "1h lalu",
    postedDate: "1 hari lalu",
    deadline: "15 November",
    tagline:
      "Jadilah bagian dari tim sales kami di PIK dan bantu pelanggan menemukan produk terbaik untuk kebutuhan mereka.",
    aboutRole: [
      "Allure Industries mencari Sales Counter yang energik dan customer-oriented untuk ditempatkan di lokasi strategis PIK, Jakarta Utara.",
      "Anda akan menjadi wajah perusahaan, bertanggung jawab atas pelayanan pelanggan secara langsung dan pencapaian target penjualan.",
    ],
    responsibilities: [
      "Melayani pelanggan yang datang ke counter dengan ramah dan profesional.",
      "Menjelaskan produk dan memberikan rekomendasi sesuai kebutuhan pelanggan.",
      "Mengelola stok display dan memastikan area counter selalu rapi.",
      "Mencapai target penjualan bulanan yang ditetapkan.",
    ],
    requirements: [
      "Minimal lulusan SMA/SMK sederajat.",
      "Berpenampilan rapi dan memiliki kemampuan komunikasi yang baik.",
      "Bersedia bekerja shift dan di akhir pekan.",
      "Pengalaman di bidang retail atau sales menjadi nilai tambah.",
    ],
    benefits: ["Gaji Pokok", "Komisi Penjualan", "BPJS", "Tunjangan Transport"],
    companyDescription:
      "Allure Industries adalah perusahaan consumer goods yang berkembang pesat dengan fokus pada produk kecantikan dan perawatan premium.",
    companyTags: ["Consumer Goods", "Retail"],
    companySize: "200-500 Karyawan",
    galleryImages: [
      { src: "/assets/workspace.png", alt: "Workspace Allure" },
      { src: "/assets/design-tool.png", alt: "Tools yang digunakan" },
    ],
  },
  {
    id: 3,
    title: "Security Operations Lead",
    company: "Dropsuite",
    verified: false,
    type: "Penuh waktu",
    typeColor: "#16A34A",
    location: "On-site • Bandung",
    locationDetail: "Bandung",
    workMode: "On-site (5 hari di kantor)",
    experience: "Min. 5+ Years Experience",
    experienceLevel: "Senior (5+ thn)",
    salary: "Negotiable",
    salaryDetail: "Negotiable",
    logoColor: "#2563EB",
    logoText: "DS",
    logoBg: "#DBEAFE",
    activeTime: "1h lalu",
    postedDate: "3 hari lalu",
    deadline: "30 November",
    tagline:
      "Pimpin tim keamanan operasional kami dan pastikan infrastruktur cloud kami terlindungi dari ancaman cyber.",
    aboutRole: [
      "Dropsuite sedang mencari Security Operations Lead yang berpengalaman untuk memimpin tim SecOps kami di Bandung. Dalam peran ini, Anda akan bertanggung jawab atas keamanan infrastruktur cloud dan data pelanggan.",
      "Anda tidak hanya mengelola security tools, tetapi juga membangun budaya keamanan di seluruh organisasi melalui training, dokumentasi, dan incident response yang efektif.",
    ],
    responsibilities: [
      "Memimpin tim Security Operations dan mengelola incident response.",
      "Mengembangkan dan mengimplementasikan security policies dan procedures.",
      "Melakukan security assessments dan penetration testing secara berkala.",
      "Berkolaborasi dengan tim development untuk memastikan secure coding practices.",
    ],
    requirements: [
      "Pengalaman 5+ tahun di bidang cybersecurity atau security operations.",
      "Sertifikasi keamanan seperti CISSP, CEH, atau OSCP.",
      "Pengalaman dengan cloud security (AWS, GCP, atau Azure).",
      "Kemampuan leadership dan mentoring yang kuat.",
    ],
    benefits: ["Asuransi Kesehatan Premium", "Remote Days", "Sertifikasi Gratis", "Stock Options"],
    companyDescription:
      "Dropsuite adalah perusahaan SaaS global yang menyediakan solusi backup dan archiving untuk bisnis di seluruh dunia. Kami berkomitmen pada keamanan data tingkat enterprise.",
    companyTags: ["SaaS", "Cybersecurity"],
    companySize: "100-200 Karyawan",
    galleryImages: [
      { src: "/assets/workspace.png", alt: "Workspace Dropsuite" },
      { src: "/assets/design-tool.png", alt: "Tools yang digunakan" },
    ],
  },
  {
    id: 4,
    title: "Sales Consultant",
    company: "Arysun Energy Group",
    verified: true,
    type: "Penuh waktu",
    typeColor: "#16A34A",
    location: "Hybrid • Jakarta Selatan",
    locationDetail: "Jakarta Selatan",
    workMode: "Hybrid (3 hari di kantor)",
    experience: "Min. 3-5 Years Experience",
    experienceLevel: "Senior (3-5 thn)",
    salary: "Rp7.000.000 - 9.000.000",
    salaryDetail: "Rp7.000.000 - Rp9.000.000",
    logoColor: "#DC2626",
    logoText: "AE",
    logoBg: "#FEE2E2",
    activeTime: "2h lalu",
    postedDate: "1 hari lalu",
    deadline: "20 November",
    tagline:
      "Bantu kami memperluas jangkauan solusi energi terbarukan ke seluruh Indonesia sebagai Sales Consultant.",
    aboutRole: [
      "Arysun Energy Group, perusahaan energi terbarukan terkemuka di Indonesia, mencari Sales Consultant yang passionate tentang sustainability untuk bergabung dengan tim kami.",
      "Dalam peran ini, Anda akan menjadi konsultan bagi klien korporat dan residensial, membantu mereka beralih ke solusi energi yang lebih bersih dan efisien.",
    ],
    responsibilities: [
      "Mengidentifikasi dan mengembangkan prospek klien baru untuk solusi energi terbarukan.",
      "Melakukan presentasi dan proposal teknis kepada calon klien.",
      "Membangun dan memelihara hubungan jangka panjang dengan klien existing.",
      "Mencapai target revenue bulanan dan quarterly.",
    ],
    requirements: [
      "Pengalaman 3-5 tahun di bidang sales B2B, preferably di industri energi atau teknologi.",
      "Kemampuan presentasi dan negosiasi yang kuat.",
      "Memiliki jaringan yang luas di sektor korporat.",
      "Memahami konsep energi terbarukan menjadi nilai tambah besar.",
    ],
    benefits: ["Gaji Kompetitif", "Komisi Tanpa Batas", "Mobil Dinas", "Asuransi Kesehatan Keluarga"],
    companyDescription:
      "Arysun Energy Group adalah perusahaan energi terbarukan yang menyediakan solusi solar panel dan sistem penyimpanan energi untuk klien korporat dan residensial di Indonesia.",
    companyTags: ["Energi Terbarukan", "B2B"],
    companySize: "100-200 Karyawan",
    galleryImages: [
      { src: "/assets/workspace.png", alt: "Workspace Arysun" },
      { src: "/assets/design-tool.png", alt: "Tools yang digunakan" },
    ],
  },
  {
    id: 5,
    title: "Management Trainee",
    company: "PT Adhimix Precast Indonesia",
    verified: false,
    type: "Penuh waktu",
    typeColor: "#16A34A",
    location: "On-site • Jakarta",
    locationDetail: "Jakarta",
    workMode: "On-site (5 hari di kantor)",
    experience: "Min. Fresh Grad",
    experienceLevel: "Fresh Graduate",
    salary: "Negotiable",
    salaryDetail: "Negotiable",
    logoColor: "#7C3AED",
    logoText: "AP",
    logoBg: "#EDE9FE",
    activeTime: "1h lalu",
    postedDate: "4 hari lalu",
    deadline: "25 November",
    tagline:
      "Program Management Trainee selama 12 bulan untuk mengembangkan pemimpin masa depan di industri konstruksi.",
    aboutRole: [
      "PT Adhimix Precast Indonesia membuka kesempatan bagi fresh graduate yang ambisius untuk bergabung dalam program Management Trainee kami. Program ini dirancang untuk mengembangkan future leaders di industri konstruksi precast.",
      "Selama 12 bulan, Anda akan rotate ke berbagai departemen, mendapatkan mentoring dari senior leaders, dan membangun fondasi karir yang kuat.",
    ],
    responsibilities: [
      "Mengikuti program rotasi di berbagai departemen (Produksi, Quality Control, Sales, dan Project Management).",
      "Menyelesaikan project assignments di setiap departemen dengan target yang terukur.",
      "Mengembangkan proposal improvement untuk proses bisnis perusahaan.",
      "Berpartisipasi dalam leadership development workshops dan training sessions.",
    ],
    requirements: [
      "Fresh graduate dari jurusan Teknik Sipil, Manajemen, atau jurusan terkait.",
      "IPK minimal 3.2 dari universitas terakreditasi.",
      "Memiliki kemampuan leadership dan inisiatif yang tinggi.",
      "Bersedia ditempatkan di seluruh wilayah operasi perusahaan.",
    ],
    benefits: ["Gaji Kompetitif", "BPJS", "Training & Development", "Career Fast-Track"],
    companyDescription:
      "PT Adhimix Precast Indonesia adalah perusahaan beton precast terkemuka yang menyuplai proyek infrastruktur besar di seluruh Indonesia.",
    companyTags: ["Konstruksi", "Manufaktur"],
    companySize: "1000+ Karyawan",
    galleryImages: [
      { src: "/assets/workspace.png", alt: "Workspace Adhimix" },
      { src: "/assets/design-tool.png", alt: "Tools yang digunakan" },
    ],
  },
  {
    id: 6,
    title: "HRD Staff",
    company: "PT Adhimix Precast Indonesia",
    verified: false,
    type: "Penuh waktu",
    typeColor: "#16A34A",
    location: "On-site • Jakarta",
    locationDetail: "Jakarta",
    workMode: "On-site (5 hari di kantor)",
    experience: "Min. 1-3 Years Experience",
    experienceLevel: "Mid-Level (1-3 thn)",
    salary: "Negotiable",
    salaryDetail: "Negotiable",
    logoColor: "#7C3AED",
    logoText: "AP",
    logoBg: "#EDE9FE",
    activeTime: "1h lalu",
    postedDate: "2 hari lalu",
    deadline: "30 November",
    tagline:
      "Bergabunglah dalam tim HR kami untuk membantu mengelola SDM terbaik di industri konstruksi Indonesia.",
    aboutRole: [
      "Kami mencari HRD Staff yang proaktif dan detail-oriented untuk mendukung operasional HR di PT Adhimix Precast Indonesia. Posisi ini akan menangani berbagai aspek manajemen SDM.",
      "Anda akan menjadi bagian penting dalam memastikan proses rekrutmen, administrasi kepegawaian, dan pengembangan karyawan berjalan dengan lancar.",
    ],
    responsibilities: [
      "Mengelola proses rekrutmen end-to-end mulai dari sourcing hingga onboarding.",
      "Mengadministrasikan data kepegawaian dan memastikan compliance dengan regulasi ketenagakerjaan.",
      "Mengelola payroll dan benefit karyawan secara akurat dan tepat waktu.",
      "Mendukung pelaksanaan program training dan development karyawan.",
    ],
    requirements: [
      "Pengalaman 1-3 tahun di bidang HR atau People Operations.",
      "Lulusan S1 Psikologi, Manajemen SDM, atau Hukum.",
      "Familiar dengan UU Ketenagakerjaan Indonesia.",
      "Mahir menggunakan HRIS dan Microsoft Office.",
    ],
    benefits: ["BPJS", "Asuransi Kesehatan", "Cuti Tahunan 12 Hari", "THR"],
    companyDescription:
      "PT Adhimix Precast Indonesia adalah perusahaan beton precast terkemuka yang menyuplai proyek infrastruktur besar di seluruh Indonesia.",
    companyTags: ["Konstruksi", "Manufaktur"],
    companySize: "1000+ Karyawan",
    galleryImages: [
      { src: "/assets/workspace.png", alt: "Workspace Adhimix" },
      { src: "/assets/design-tool.png", alt: "Tools yang digunakan" },
    ],
  },
];

/* Helper to get a card-compatible subset */
export function toCardData(job: JobDetail): JobCardData {
  return {
    id: job.id,
    title: job.title,
    company: job.company,
    verified: job.verified,
    type: job.type,
    typeColor: job.typeColor,
    location: job.location,
    experience: job.experience,
    salary: job.salary,
    logoColor: job.logoColor,
    logoText: job.logoText,
    logoBg: job.logoBg,
    activeTime: job.activeTime,
  };
}
