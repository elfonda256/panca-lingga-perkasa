/**
 * Database Seeder for PT Panca Lingga Perkasa CMS
 * Seeds initial products, projects, services, settings, and admin user.
 */
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const DATA_DIR = path.join(__dirname);
const DB_FILE = path.join(DATA_DIR, 'db.json');

async function seed() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  // Hash default admin password: "adminplp2026"
  const salt = bcrypt.genSaltSync(10);
  const passwordHash = bcrypt.hashSync('adminplp2026', salt);

  const initialData = {
    users: [
      {
        id: 'usr-1',
        name: 'Administrator PLP',
        email: 'admin@pancalingga.com',
        password: passwordHash,
        role: 'superadmin',
        createdAt: new Date().toISOString()
      }
    ],
    settings: {
      companyName: 'PT Panca Lingga Perkasa',
      tagline: 'Membangun Infrastruktur Andal, Mengalirkan Kepercayaan Nyata.',
      motto: 'Minimize Cost, Maximum Simplicity',
      sinceYear: 2015,
      phone: '+62 813-9050-6150',
      whatsapp: '6281390506150',
      email: 'pancalinggaperkasa@gmail.com',
      addressTangerang: 'Cluster Green Valley Serpong Garden E.17 No.04, Cibogo, Cisauk, Kabupaten Tangerang, Banten 15344.',
      addressCirebon: 'Jalan Raya Pantura Cirebon, Desa Plumbon RT 07 / RW 02, Kec. Plumbon, Kabupaten Cirebon, Jawa Barat.',
      operatingHours: 'Senin - Sabtu: 08.00 - 17.00 WIB',
      metaDescription: 'PT Panca Lingga Perkasa - Mitra terpercaya kontraktor MEP, Instrumentasi & Kontrol Sistem, Real-Time Monitoring IoT, serta Distributor Resmi GreenPrima di Indonesia.'
    },
    services: [
      {
        id: 'srv-1',
        title: 'Mechanical, Electrical & Plumbing (MEP)',
        icon: 'cog',
        description: 'Instalasi pipa industri, pompa distribusi air bersih & limbah (STP/WTP), panel daya, hydrant sistem pemadam kebakaran, serta sistem conveyor pabrik berkapasitas besar.',
        image: 'images/proyek-conveyor-pusri.png',
        features: [
          'Pemasangan Pipa & Pompa Tekanan Tinggi',
          'Instalasi Hydrant & Plumbing Industri',
          'Panel Kelistrikan MCC & Distribusi'
        ],
        featured: false,
        order: 1
      },
      {
        id: 'srv-2',
        title: 'Instrumentasi & Smart Control System',
        icon: 'cpu',
        description: 'Integrasi sensor proses presisi, PLC/SCADA, transmitter debit & level air, serta dashboard pemantauan digital real-time berbasis IoT (LoRaWAN & telemetry).',
        image: 'images/proyek-soetta-analytics.png',
        features: [
          'Real-time Water Monitoring Dashboard',
          'Kalibrasi & Pemasangan Sensor Digital',
          'Integrasi SCADA, PLC, & IoT Logger'
        ],
        featured: true,
        order: 2
      },
      {
        id: 'srv-3',
        title: 'Konstruksi Sipil & Fabrikasi Baja',
        icon: 'building',
        description: 'Pembangunan struktur gedung utilitas (MCC), reservoir air skala masif (2000 m³), perkuatan platform jembatan, temporary jetty, serta fabrikasi struktur baja presisi.',
        image: 'images/proyek-musi-steel.png',
        features: [
          'Struktur Gedung MCC & Gardu Listrik',
          'Reservoir Kapasitas Besar & Pondasi Gantry',
          'Fabrikasi Baja Presisi & Erection'
        ],
        featured: false,
        order: 3
      },
      {
        id: 'srv-4',
        title: 'Pengadaan & Rental Alat Berat',
        icon: 'truck',
        description: 'Didukung armada peralatan mandiri untuk menjamin kelancaran proyek: Excavator Kobelco SK200, Komatsu PC-75, pemotong beton/aspal, genset, dan mesin las profesional.',
        image: 'images/proyek-gantry-foundation.png',
        features: [
          'Sewa Excavator (Kobelco SK200, Komatsu)',
          'Concrete Cutting & Jack Hammer',
          'Ultrasonic Sensor Tester & Welder'
        ],
        featured: false,
        order: 4
      }
    ],
    products: [
      {
        id: 'prod-gp-1',
        brand: 'greenprima',
        brandLabel: 'GreenPrima Instruments (UK)',
        category: 'gp-flow',
        categoryLabel: 'Flowmeter & Debit',
        name: 'GreenPrima Electromagnetic Flow Meter',
        image: 'images/prod-mag-flowmeter-unit.png',
        badge: '🇬🇧 GreenPrima • Flowmeter',
        description: 'Pengukur debit cairan konduktif dengan presisi tinggi tanpa hambatan mekanis, cocok untuk jaringan air minum PDAM, STP bandara, dan air limbah industri.',
        specs: {
          method: 'Elektromagnetik (Faraday Law)',
          range: 'DN10 - DN2000',
          accuracy: '±0.5% (Standar), ±0.2% (Opsional)',
          output: '4-20mA, Pulse, RS485 Modbus, LoRaWAN / GPRS Logger',
          bullet1: 'Output 4-20mA / Modbus RS485',
          bullet2: 'Proteksi IP68 Rendam Air'
        },
        fullModalDesc: 'Alat pengukur aliran elektromagnetik presisi tinggi yang didesain khusus untuk media fluida konduktif seperti air baku, air minum, limbah pabrik, dan bubur kimia. Menghasilkan pembacaan stabil tanpa kehilangan tekanan hidrolik.',
        order: 1
      },
      {
        id: 'prod-gp-2',
        brand: 'greenprima',
        brandLabel: 'GreenPrima Instruments (UK)',
        category: 'gp-water',
        categoryLabel: 'Water Quality Analyzer',
        name: 'GreenPrima Online Turbidity Meter & Controller',
        image: 'images/prod-turbidity-unit.png',
        badge: '🇬🇧 GreenPrima • Turbidity',
        description: 'Sensor kekeruhan air online dengan sistem pembersihan otomatis (self-cleaning wiper) untuk pemantauan WTP, instalasi pengolahan air minum, dan effluent industri.',
        specs: {
          method: 'Infrared 90° Light Scattering (ISO 7027)',
          range: '0.01 - 1000 NTU (Dapat diatur)',
          accuracy: '±2% dari skala penuh',
          output: 'Display Digital, 4-20mA, Modbus RS485',
          bullet1: 'Rentang 0-1000 NTU / FNU',
          bullet2: 'Dilengkapi Wiper Pembersih Optik'
        },
        fullModalDesc: 'Penganalisis tingkat kekeruhan air secara real-time berbasis prinsip hamburan cahaya inframerah 90° (ISO 7027). Tahan terhadap lumut dan sedimen berkat teknologi wiper mekanis otomatis.',
        order: 2
      },
      {
        id: 'prod-gp-3',
        brand: 'greenprima',
        brandLabel: 'GreenPrima Instruments (UK)',
        category: 'gp-water',
        categoryLabel: 'Water Quality Analyzer',
        name: 'Multi-Parameter Water Quality Cabinet (GPS200MAS)',
        image: 'images/prod-gps200-cabinet.png',
        badge: '🇬🇧 GreenPrima • Water Cabinet',
        description: 'Sistem kabinet monitoring kualitas air terintegrasi untuk mengukur parameter kritis: pH, Kekeruhan (Turbidity), Sisa Klorin (Residual Chlorine), Konduktivitas, dan Suhu secara kontinyu.',
        specs: {
          method: 'Multi-Sensor Flow-Through Panel',
          range: 'pH (0-14), Turbidity (0-100 NTU), Chlorine (0-5 mg/L), Cond (0-2000 uS/cm)',
          accuracy: '±1% - ±2% FS',
          output: 'Modbus RTU RS485, Analog 4-20mA, Touchscreen LCD',
          bullet1: 'Integrasi 5 Parameter Sekaligus',
          bullet2: 'Sistem Sirkulasi & Flow Cell Mandiri'
        },
        fullModalDesc: 'Sistem analisis kualitas air terpadu berbasis kabinet tertutup yang menggabungkan berbagai probe sensor presisi dalam satu panel ringkas dengan sistem pembuangan air sampel otomatis.',
        order: 3
      },
      {
        id: 'prod-gp-4',
        brand: 'greenprima',
        brandLabel: 'GreenPrima Instruments (UK)',
        category: 'gp-level',
        categoryLabel: 'Level & Dosing',
        name: 'Ultrasonic Level Transmitter (ProLevel)',
        image: 'images/prod-level-sensor-unit.png',
        badge: '🇬🇧 GreenPrima • Level Sensor',
        description: 'Transmitter level non-kontak dengan teknologi gelombang ultrasonik untuk mendeteksi ketinggian air sungai, reservoir, tangki kimia, dan saluran terbuka tanpa menyentuh cairan.',
        specs: {
          method: 'Non-Contact Ultrasonic Echo Echo',
          range: '0.3 - 15 Meter',
          accuracy: '±0.25% - ±0.5% Skala Penuh',
          output: '4-20mA 2-Wire / 4-Wire, RS485 Modbus, Relay Alarm',
          bullet1: 'Jangkauan Ukur 5m / 10m / 15m',
          bullet2: 'Tahan Cuaca Ekstrem IP67 / IP68'
        },
        fullModalDesc: 'Sensor pengukur jarak dan ketinggian permukaan cairan tanpa kontak fisik langsung. Dilengkapi kompensasi suhu otomatis untuk mencegah bias data akibat terik matahari.',
        order: 4
      },
      {
        id: 'prod-gp-5',
        brand: 'greenprima',
        brandLabel: 'GreenPrima Instruments (UK)',
        category: 'gp-water gp-level',
        categoryLabel: 'Water Quality & Dosing',
        name: 'Streaming Current Monitor & Dosing Controller',
        image: 'images/prod-streaming-current.png',
        badge: '🇬🇧 GreenPrima • Coagulant Control',
        description: 'Penganalisis muatan ion koloid air (streaming current) untuk mengontrol dosis koagulan (PAC/Alum) secara otomatis pada instalasi WTP sehingga menghemat bahan kimia hingga 30%.',
        specs: {
          method: 'Streaming Current Electrokinetic Measurement',
          range: '-100.0 hingga +100.0 SCU',
          accuracy: '±1% FS',
          output: '4-20mA Output, PID Controller untuk Pompa Dosing, RS485',
          bullet1: 'Optimalisasi Dosing Koagulan Otomatis',
          bullet2: 'Menghemat Biaya Kimia WTP hingga 30%'
        },
        fullModalDesc: 'Alat penganalisis muatan elektrokinetik partikel terlarut dalam air baku untuk memandu pompa dosing kimia secara otomatis dan presisi, mencegah kelebihan atau kekurangan dosis koagulan.',
        order: 5
      },
      {
        id: 'prod-eco-1',
        brand: 'ecopro',
        brandLabel: 'Shanghai Ecopro Environmental',
        category: 'eco-sep',
        categoryLabel: 'Pemisah Padatan & DAF',
        name: 'Curved Arc Sieve Screen Separator',
        image: 'images/prod-ecopro-sieve-screen.png',
        badge: '🇨🇳 Ecopro • Sieve Screen',
        description: 'Saringan lengkung pemisah padatan limbah padat-cair berbasis gravitasi (gravity arc screen) berbahan stainless steel tahan karat tanpa konsumsi energi listrik operasional.',
        specs: {
          method: 'Static Gravity Arc Screen / Wedge Wire Mesh',
          range: 'Debit 5 m³/h hingga 300 m³/h',
          accuracy: 'Gap Saringan 0.25 - 3.0 mm',
          output: 'Material Full Stainless Steel SUS304/SUS316L',
          bullet1: 'Material Stainless Steel SS304 / SS316',
          bullet2: 'Celah Saringan Presisi 0.25mm - 2.0mm'
        },
        fullModalDesc: 'Peralatan pemisah mekanis tanpa daya gerak motor untuk menyaring partikel kasar, serat, ampas, dan kotoran padat dari aliran air limbah industri (pabrik kertas, makanan, tekstil, dan RPH).',
        order: 6
      },
      {
        id: 'prod-eco-2',
        brand: 'ecopro',
        brandLabel: 'Shanghai Ecopro Environmental',
        category: 'eco-sep',
        categoryLabel: 'Pemisah Padatan & DAF',
        name: 'Dissolved Air Flotation (DAF) System',
        image: 'images/prod-ecopro-daf-flotation.png',
        badge: '🇨🇳 Ecopro • DAF Flotation',
        description: 'Unit pengolahan air limbah terpadu dengan teknologi mikro-gelembung udara untuk memisahkan lemak, minyak (FOG), dan padatan tersuspensi (TSS) secara kontinyu dan efisien.',
        specs: {
          method: 'High Pressure Dissolved Air Flotation',
          range: 'Kapasitas 5 m³/jam hingga 500 m³/jam',
          accuracy: 'Pemisahan TSS >95%, Minyak/Lemak >90%',
          output: 'Struktur Baja Karbon Berlapis Epoxy / Stainless Steel',
          bullet1: 'Efisiensi Pemisahan TSS & Minyak > 95%',
          bullet2: 'Dilengkapi Automatic Sludge Skimmer'
        },
        fullModalDesc: 'Sistem flotasi udara terlarut bertekanan tinggi yang menghasilkan gelembung mikro 20-30 mikron untuk mengangkat flok limbah, minyak, dan koloid ke permukaan air bak flotasi.',
        order: 7
      },
      {
        id: 'prod-eco-3',
        brand: 'ecopro',
        brandLabel: 'Shanghai Ecopro Environmental',
        category: 'eco-dosing',
        categoryLabel: 'Dosing & Otomatisasi',
        name: 'Automatic Polymer & Chemical Dosing System',
        image: 'images/prod-ecopro-auto-dosing.png',
        badge: '🇨🇳 Ecopro • Polymer Dosing',
        description: 'Sistem otomatisasi terpadu 3-kompartemen untuk pelarutan bubuk, pematangan, dan penginjeksian bahan kimia koagulan/flokulan (PAC/PAM) secara presisi dengan kontrol PLC & Layar Sentuh HMI.',
        specs: {
          method: '3-Stage Continuous Polymer Preparation (Dissolving, Aging, Storage)',
          range: 'Kapasitas Larutan 500 L/h - 6000 L/h',
          accuracy: 'Presisi Dosing ±1.0%',
          output: 'Material Stainless Steel SUS304, PLC HMI Controller',
          bullet1: 'Kontrol Otomatis PLC Siemens / Touchscreen',
          bullet2: '3-Tank Continuous Dissolving System'
        },
        fullModalDesc: 'Mesin penyiapan dan pelarutan polimer otomatis berkelanjutan untuk memastikan konsentrasi flokulan yang tepat tanpa gumpalan (fisheye), mengurangi limbah kimia, dan menghemat biaya operasional IPAL.',
        order: 8
      },
      {
        id: 'prod-eco-4',
        brand: 'ecopro',
        brandLabel: 'Shanghai Ecopro Environmental',
        category: 'eco-ozone',
        categoryLabel: 'Disinfeksi & Ozon',
        name: 'Industrial Ozone Generator & Disinfection',
        image: 'images/prod-ecopro-ozone-generator.png',
        badge: '🇨🇳 Ecopro • Ozone Generator',
        description: 'Generator ozon industri berdaya tinggi untuk sterilisasi mikroorganisme, degradasi zat warna limbah kimia/tekstil, penghilang bau, dan proses oksidasi lanjutan (AOPs) pada air limbah.',
        specs: {
          method: 'High Frequency Corona Discharge with Oxygen Feed',
          range: 'Kapasitas Output 50 g/h hingga 5 kg/h',
          accuracy: 'Konsentrasi Ozon 80 - 120 mg/L',
          output: 'Dilengkapi Ozone Destructor & Safety Interlock',
          bullet1: 'Teknologi Tabung Dielektrik Keramik/Kaca',
          bullet2: 'Daya Oksidasi Tinggi Tanpa Residu Kimia'
        },
        fullModalDesc: 'Unit pembangkit gas ozon berkapasitas besar untuk desinfeksi air murni, pengolahan air limbah B3, penghilangan warna zat pewarna tekstil, dan oksidasi polutan organik membandel.',
        order: 9
      },
      {
        id: 'prod-molinar-1',
        brand: 'molinar',
        brandLabel: 'Molinar Cloud & IoT Multi-Management',
        category: 'mol-hardware mol-edge',
        categoryLabel: 'Data Logger & Edge (Hardware)',
        name: 'Molinar Industrial Smart Data Logger (MLR-S3 / LTE7600)',
        image: 'images/prod-molinar-logger.png',
        badge: '🌐 Molinar • Smart Data Logger',
        description: 'Data logger industri multi-konektivitas (4G LTE, Ethernet, Wi-Fi) dengan auto-failover, pembacaan sensor Modbus RS485 & Analog, otomasi lokal IF-THEN (Edge), dan MicroSD Store & Forward.',
        specs: {
          method: 'Multi-Channel Edge Processing & Auto-Failover Telemetry',
          range: 'RS485 Modbus RTU (KF301), Analog 4-20mA / 0-10V, Digital IO',
          accuracy: 'Sampling Real-time (Hingga 100ms), RTC Sync ±1 ppm',
          output: '4G LTE (SIM7600CE), Ethernet (W5500), Wi-Fi STA, MicroSD 128GB',
          bullet1: 'Auto-Failover 3 Jaringan (4G / LAN / Wi-Fi)',
          bullet2: 'Otomasi Lokal IF-THEN & Store-Forward'
        },
        fullModalDesc: 'Data logger cerdas generasi terbaru yang dirancang untuk keandalan ekstrim pada aplikasi industri, WTP/WWTP, dan pertanian cerdas. Menghadirkan web configuration lokal, live sensor ping, kalibrasi linear offset/gain, update firmware OTA, dan penyimpanan offline MicroSD saat koneksi terputus.',
        order: 10
      },
      {
        id: 'prod-molinar-2',
        brand: 'molinar',
        brandLabel: 'Molinar Cloud & IoT Multi-Management',
        category: 'mol-cloud mol-ai',
        categoryLabel: 'Cloud Platform & AI Analytics',
        name: 'Molinar Cloud Enterprise IoT & AI Analytics Platform',
        image: 'images/prod-molinar-cloud.png',
        badge: '☁️ Molinar • Cloud & AI',
        description: 'Platform cloud terpusat untuk monitoring geospasial real-time, sensor registry lintas lokasi, telekontrol jarak jauh aktuator/chiller/heater, dan otomasi skenario cloud lintas perangkat.',
        specs: {
          method: 'Cloud Telemetry & AI/ML Predictive Analytics',
          range: 'Unlimited Multi-Device & Multi-Client Hierarchy',
          accuracy: 'Live Stream Telemetry (WebSocket/MQTT), SLA Tracking 99.9%',
          output: 'MQTT Broker, Webhook, REST API, OPC-UA, CSV Export',
          bullet1: 'Telekontrol Jarak Jauh & Peta Geospasial',
          bullet2: 'Skenario Otomasi Lintas Perangkat (Cloud)'
        },
        fullModalDesc: 'Pusat kendali dan analitik data berbasis cloud modern yang memvisualisasikan data sensor dalam peta persebaran interaktif dan grafik real-time. Dilengkapi fitur telekontrol aktuator instan, manajemen SLA uptime, dan logika otomatisasi server-side antar-perangkat.',
        order: 11
      },
      {
        id: 'prod-molinar-3',
        brand: 'molinar',
        brandLabel: 'Molinar Cloud & IoT Multi-Management',
        category: 'mol-solution mol-edge',
        categoryLabel: 'Smart Agriculture & Vertical Farming Kit',
        name: 'Molinar Smart Vertical Agriculture & Environment Monitoring Kit',
        image: 'images/prod-molinar-farm.png',
        badge: '🌱 Molinar • Smart Agriculture',
        description: 'Paket solusi IoT terintegrasi untuk rumah kaca, menara pertanian vertikal, dan pemantauan iklim mikro dengan kontrol irigasi/misting otomatis dan forecasting analitik AI.',
        specs: {
          method: 'Precision Micro-Climate Monitoring & Closed-Loop Control',
          range: 'Suhu Udara (-40~85°C), RH (0~100%), EC, pH, NPK, Soil Moisture',
          accuracy: 'Suhu ±0.3°C, Kelembaban ±2% RH',
          output: 'Modbus RS485, Telekontrol Relay Pompa/Misting/Lighting',
          bullet1: 'Kontrol Pengkabutan & Nutrisi Otomatis',
          bullet2: 'Prediksi AI Pertumbuhan & Alarm Anomali'
        },
        fullModalDesc: 'Solusi otomasi pertanian presisi yang menghubungkan sensor kelembapan tanah, suhu, dan intensitas cahaya dengan aktuator pengkabutan, kipas ventilasi, dan pompa nutrisi secara otonom untuk memaksimalkan hasil panen.',
        order: 12
      }
    ],
    projects: [
      {
        id: 'proj-1',
        group: 'airport',
        groupLabel: 'Bandara & Smart Water',
        title: 'Digital Water Monitoring System & STP Flowmeter Terminal 1 & 2',
        client: 'PT Angkasa Pura II',
        location: 'Bandara Int. Soekarno-Hatta',
        tag: 'MEP & Real-Time IoT',
        image: 'images/proyek-soetta-dashboard.png',
        story: 'Mengintegrasikan sistem pemantauan debit air bersih digital real-time dan penggantian flowmeter outlet STP 745. Membantu manajemen bandara memantau distribusi konsumsi air antar-terminal secara presisi selama 24/7 tanpa henti.',
        highlight: 'Zero Interruption pada Operasional Penerbangan',
        order: 1
      },
      {
        id: 'proj-2',
        group: 'industrial',
        groupLabel: 'Industri & Pabrik (Adhi Karya)',
        title: 'Pembangunan Gedung MCC, Conveyor System & Fabrikasi Steel Structure',
        client: 'PT Adhi Karya (Persero) Tbk',
        location: 'PT PUSRI – Palembang',
        tag: 'Konstruksi & Fabrikasi',
        image: 'images/proyek-conveyor-pusri.png',
        story: 'Eksekusi pekerjaan agregat B pada proyek UBS-IIB & CS Pusri Palembang, konstruksi gedung pusat kontrol listrik (MCC), serta fabrikasi struktur baja penopang dan take-up system dengan standar keselamatan industri pupuk yang ketat.',
        highlight: 'Selesai Sesuai Standar K3 Nasional',
        order: 2
      },
      {
        id: 'proj-3',
        group: 'industrial infra',
        groupLabel: 'Konstruksi Jembatan & Sungai',
        title: 'Pembuatan Temporary Jetty, Perkuatan Platform & Pembongkaran Steel Pipe Pile',
        client: 'PT Adhi Karya (Persero) Tbk',
        location: 'Sungai Musi, Palembang',
        tag: 'Heavy Engineering',
        image: 'images/proyek-piping-welder.png',
        story: 'Tantangan arus deras sungai Musi ditaklukkan tim kami dalam pembongkaran pipa pancang baja Ø100cm (tebal 16mm), pembuatan dermaga darurat (temporary jetty), dan perkuatan platform kerja untuk kelancaran ereksi jembatan penghubung vital.',
        highlight: 'Ketahanan Struktur di Kondisi Sungai Ekstrem',
        order: 3
      },
      {
        id: 'proj-4',
        group: 'industrial infra',
        groupLabel: 'Fabrikasi Baja Industri',
        title: 'Fabrikasi & Ereksi Struktur Rangka Baja Menara Industri',
        client: 'PT Adhi Karya (Persero) Tbk',
        location: 'Palembang, Sumatera Selatan',
        tag: 'Fabrikasi & Alat Berat',
        image: 'images/proyek-musi-steel.png',
        story: 'Pekerjaan pengangkatan dan perakitan struktur rangka baja bentang tinggi menggunakan mobil crane berkapasitas besar, dilengkapi perkuatan sambungan baut mutu tinggi serta pengawasan K3 industri secara terpadu.',
        highlight: 'Presisi Alignment & Standar Keselamatan Tinggi',
        order: 4
      },
      {
        id: 'proj-5',
        group: 'infra',
        groupLabel: 'Konstruksi & Jembatan (Bukaka)',
        title: 'Pengecoran Jalur Rel Pondasi Gantry Crane & Lorry Transfer',
        client: 'PT Bukaka Teknik Utama',
        location: 'Bekasi, Jawa Barat',
        tag: 'Pondasi Alat Berat & Rel Gantry',
        image: 'images/proyek-gantry-foundation.png',
        story: 'Konstruksi pembesian dan pengecoran jalur rel gantry crane dan lorry transfer untuk fasilitas pabrikasi jembatan. Mampu menahan beban lalu lintas komponen baja berbobot puluhan ton secara kontinyu tanpa deformasi.',
        highlight: 'Daya Dukung Beban Ekstra (Heavy Load)',
        order: 5
      },
      {
        id: 'proj-6',
        group: 'infra',
        groupLabel: 'Konstruksi & Jembatan (Bukaka)',
        title: 'Pengecoran Lantai Kerja Workshop Area F & G (Heavy-Duty Slab)',
        client: 'PT Bukaka Teknik Utama',
        location: 'Bekasi, Jawa Barat',
        tag: 'Konstruksi Lantai Industri',
        image: 'images/proyek-bukaka-workshop.png',
        story: 'Pengecoran lantai kerja berkekuatan beban tinggi (heavy duty slab) dan finishing marka keselamatan pada fasilitas workshop fabrikasi jembatan baja, menjamin kelancaran alur produksi komponen jembatan nasional.',
        highlight: 'Standar Lantai Industri Pabrikasi Jembatan',
        order: 6
      },
      {
        id: 'proj-7',
        group: 'pdam',
        groupLabel: 'PDAM & Instrumentasi',
        title: 'Pemasangan Flowmeter Digital Outdoor & Transmitter Debit Air',
        client: 'PDAM & Smart Water Utility',
        location: 'Banyuwangi & Jawa Timur',
        tag: 'Instrumentasi & Flowmeter Lapangan',
        image: 'images/prod-mag-flowmeter.png',
        story: 'Instalasi instrumen pengukur debit air digital dalam kabinet proteksi cuaca outdoor di samping kolam penampungan air. Menghasilkan pembacaan laju aliran air baku secara kontinyu untuk menekan tingkat kehilangan air (NRW).',
        highlight: 'Proteksi Tahan Cuaca & Rendam Air (IP68)',
        order: 7
      },
      {
        id: 'proj-8',
        group: 'pdam airport',
        groupLabel: 'Panel Maker & Automation',
        title: 'Perakitan Kabinet Panel Kontrol Instrumentasi, PLC & Telemetri',
        client: 'Panel Maker & Automation',
        location: 'Workshop Cirebon & Tangerang',
        tag: 'Control System & Telemetri',
        image: 'images/proyek-panel-control.png',
        story: 'Perakitan wiring terminal kabinet panel kontrol instrumen otomatisasi oleh teknisi bersertifikat kami untuk kendali pompa, monitoring sensor kualitas air, dan komunikasi data nirkabel LoRaWAN / GSM ke server pusat.',
        highlight: 'Wiring Rapi, Uji Fungsi & Komisioning Total',
        order: 8
      }
    ],
    messages: [
      {
        id: 'msg-sample-1',
        name: 'Bpk. Bambang Sutrisno',
        company: 'PDAM Tirta Raharja',
        phone: '081234567890',
        service: 'GreenPrima Flowmeter & Sensor',
        message: 'Mohon penawaran harga dan spesifikasi teknis untuk 4 unit Electromagnetic Flowmeter DN200 beserta transmitter RS485 Modbus untuk instalasi IPA kami.',
        status: 'unread',
        createdAt: new Date(Date.now() - 3600000 * 4).toISOString()
      },
      {
        id: 'msg-sample-2',
        name: 'Ibu Ratna Dewi',
        company: 'PT Indah Kiat Pulp & Paper',
        phone: '081398765432',
        service: 'Smart Real-Time Monitoring IoT',
        message: 'Kami memerlukan sistem monitoring kualitas air terpadu (pH, Turbidity, DO) untuk pemenuhan SPARING KLHK. Apakah bisa dijadwalkan survey lokasi minggu depan?',
        status: 'read',
        createdAt: new Date(Date.now() - 3600000 * 24).toISOString()
      }
    ]
  };

  fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
  console.log('✅ Database berhasil di-seed di:', DB_FILE);
  console.log('🔑 Akun Admin Default:');
  console.log('   Email   : admin@pancalingga.com');
  console.log('   Password: adminplp2026');
}

if (require.main === module) {
  seed();
}

module.exports = { seed };
