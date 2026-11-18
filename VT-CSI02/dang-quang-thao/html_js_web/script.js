// ============================================================================
// CẤU HÌNH KHÓA GEMINI API DỰ PHÒNG TRONG CODE (FALLBACK API KEY)
// Chỉ cần dán mã API Key (bắt đầu bằng "AIzaSy...") vào biến bên dưới,
// hệ thống sẽ tự động dùng Key này khi trên giao diện Web chưa nhập Key.
// ============================================================================
const FALLBACK_GEMINI_API_KEY = ""; // <-- Dán API Key dự phòng vào giữa 2 dấu nháy kép này
const DEFAULT_GEMINI_API_KEY = FALLBACK_GEMINI_API_KEY;

// ============================================================================
// 1. DỮ LIỆU 20 NGÀNH HỌC ĐẠI HỌC VIỆT NAM (ĐỒNG BỘ VỚI FILE GOOGLE COLAB)
// ============================================================================
const MAJORS_DATA = [
  {
    stt: 1,
    id: "cntt",
    name: "Công nghệ thông tin (Information Technology)",
    code: "7480201",
    group: "Công nghệ - Kỹ thuật",
    groupKey: "tech",
    blocks: "A00, A01, D01, D07",
    score: "24.0 – 28.5",
    universities: "ĐH Bách Khoa Hà Nội, ĐH Công nghệ (ĐHQG HN), ĐH CNTT (ĐHQG TP.HCM), PTIT, ĐH FPT",
    description: "Đào tạo nền tảng và chuyên sâu về kỹ nghệ phần mềm, phát triển Web/Mobile, hệ thống thông tin, mạng máy tính và điện toán đám mây.",
    subjects: "Nhập môn lập trình, Cấu trúc dữ liệu & Giải thuật, Cơ sở dữ liệu, Phát triển Web/Mobile, Mạng máy tính & Cloud.",
    careers: "Lập trình viên Fullstack/Backend/Mobile, QA/Tester, Business Analyst (BA), Kỹ sư DevOps/Cloud.",
    salary: "10 – 18 triệu/tháng (mới ra trường); 25 – 60+ triệu/tháng (Senior)",
    notes: "Phù hợp với học sinh có tư duy logic tốt, kiên nhẫn, thích giải quyết bài toán bằng lập trình và tự học công nghệ mới."
  },
  {
    stt: 2,
    id: "khdl_ai",
    name: "Khoa học dữ liệu & Trí tuệ nhân tạo (Data Science & AI)",
    code: "7480107",
    group: "Công nghệ - Kỹ thuật",
    groupKey: "tech",
    blocks: "A00, A01, D01",
    score: "26.0 – 29.0",
    universities: "ĐH Bách Khoa HN, ĐH Công nghệ (ĐHQG HN), ĐH KHTN (ĐHQG TP.HCM), ĐH Bách Khoa TP.HCM, ĐH Kinh tế Quốc dân",
    description: "Nghiên cứu khai phá dữ liệu lớn (Big Data), Học máy (Machine Learning), Học sâu (Deep Learning), Xử lý ngôn ngữ tự nhiên (NLP) và Thị giác máy tính.",
    subjects: "Đại số tuyến tính, Xác suất thống kê, Machine Learning, Deep Learning, Xử lý ngôn ngữ tự nhiên (NLP), Computer Vision.",
    careers: "Kỹ sư AI/Machine Learning, Data Scientist, Data Engineer, Data Analyst, Chuyên gia R&D AI.",
    salary: "15 – 25 triệu/tháng (mới ra trường); 35 – 80+ triệu/tháng (Senior)",
    notes: "Đòi hỏi nền tảng Toán học (Đại số, Giải tích, Xác suất thống kê) vững chắc và đam mê lập trình Python."
  },
  {
    stt: 3,
    id: "attt",
    name: "An toàn thông tin (Cyber Security)",
    code: "7480202",
    group: "Công nghệ - Kỹ thuật",
    groupKey: "tech",
    blocks: "A00, A01, D01",
    score: "24.5 – 27.5",
    universities: "Học viện Kỹ thuật Mật mã (KMA), PTIT, ĐH CNTT (ĐHQG TP.HCM), ĐH Bách Khoa HN",
    description: "Đào tạo chuyên gia bảo vệ hạ tầng mạng và dữ liệu số, mật mã học, kiểm thử xâm nhập (Pentest), điều tra số và vận hành trung tâm SOC.",
    subjects: "Mật mã học, An toàn mạng máy tính, Kiểm thử xâm nhập (Pentest), Phân tích mã độc, Điều tra số (Digital Forensics).",
    careers: "Chuyên viên Pentest (Red Team), Kỹ sư giám sát an ninh mạng SOC (Blue Team), Kỹ sư bảo mật DevSecOps.",
    salary: "12 – 22 triệu/tháng (mới ra trường); 30 – 70 triệu/tháng (Senior)",
    notes: "Cần tính tỉ mỉ, tư duy phân tích hệ thống sâu và đạo đức nghề nghiệp nghiêm ngặt."
  },
  {
    stt: 4,
    id: "dtvt_vi_mach",
    name: "Kỹ thuật Điện tử - Viễn thông & Thiết kế Vi mạch",
    code: "7520207",
    group: "Công nghệ - Kỹ thuật",
    groupKey: "tech",
    blocks: "A00, A01, D07",
    score: "23.5 – 27.5",
    universities: "ĐH Bách Khoa HN, ĐH Bách Khoa TP.HCM, ĐH Công nghệ (ĐHQG HN), PTIT, ĐH Bách Khoa Đà Nẵng",
    description: "Đào tạo về mạch điện tử, hệ thống nhúng (Embedded), IoT, mạng 5G/6G và thiết kế chip bán dẫn (IC Design / VLSI).",
    subjects: "Lý thuyết mạch, Điện tử số, Vi xử lý & Hệ thống nhúng, Thiết kế vi mạch VLSI/IC Design, Mạng 5G & IoT.",
    careers: "Kỹ sư thiết kế vi mạch bán dẫn (IC Design), Kỹ sư lập trình nhúng IoT, Kỹ sư viễn thông (Viettel, FPT, Qualcomm, Synopsys).",
    salary: "12 – 22 triệu/tháng (mới ra trường); 28 – 65+ triệu/tháng (Kỹ sư vi mạch)",
    notes: "Ngành mũi nhọn chiến lược quốc gia về công nghiệp bán dẫn; phù hợp với học sinh giỏi Toán và Vật lý."
  },
  {
    stt: 5,
    id: "tdh_co_dien_tu",
    name: "Kỹ thuật Điều khiển - Tự động hóa & Cơ điện tử",
    code: "7520216",
    group: "Công nghệ - Kỹ thuật",
    groupKey: "tech",
    blocks: "A00, A01",
    score: "24.0 – 28.0",
    universities: "ĐH Bách Khoa HN, ĐH Bách Khoa TP.HCM, ĐH Sư phạm Kỹ thuật TP.HCM, ĐH Công nghiệp HN",
    description: "Kết hợp cơ khí chính xác, điện tử và điều khiển tự động để thiết kế dây chuyền sản xuất, robot công nghiệp và nhà máy thông minh.",
    subjects: "Lý thuyết điều khiển tự động, Lập trình PLC & SCADA, Kỹ thuật Robot, Điện tử công suất, Cảm biến & Đo lường.",
    careers: "Kỹ sư tự động hóa PLC/SCADA, Kỹ sư Robot, Kỹ sư R&D tại Samsung, LG, Bosch, VinFast, Foxconn.",
    salary: "10 – 18 triệu/tháng (mới ra trường); 22 – 45 triệu/tháng (Kỹ sư chính)",
    notes: "Phù hợp với học sinh yêu thích máy móc, chế tạo robot và hệ thống tự động hóa công nghiệp."
  },
  {
    stt: 6,
    id: "ky_thuat_o_to",
    name: "Kỹ thuật Ô tô & Công nghệ Xe điện (Automotive & EV)",
    code: "7520130",
    group: "Công nghệ - Kỹ thuật",
    groupKey: "tech",
    blocks: "A00, A01, D07",
    score: "23.0 – 27.0",
    universities: "ĐH Bách Khoa HN, ĐH Sư phạm Kỹ thuật TP.HCM, ĐH Bách Khoa TP.HCM, ĐH Giao thông Vận tải",
    description: "Thiết kế, chế tạo, chẩn đoán và vận hành ô tô truyền thống, ô tô điện (EV) và hệ thống điều khiển thông minh trên phương tiện.",
    subjects: "Lý thuyết ô tô, Động cơ & Hệ thống truyền lực, Công nghệ Ô tô điện & Pin năng lượng, Điện - điện tử ô tô.",
    careers: "Kỹ sư R&D ô tô (VinFast, Thaco, Toyota, Hyundai), Kỹ sư phần mềm nhúng ô tô (Bosch, FPT Automotive).",
    salary: "10 – 17 triệu/tháng (mới ra trường); 20 – 45 triệu/tháng (Kỹ sư R&D/Quản lý)",
    notes: "Xu hướng chuyển dịch sang xe điện và xe tự hành đang mở ra nhu cầu nhân lực kỹ thuật rất lớn."
  },
  {
    stt: 7,
    id: "kien_truc_xay_dung",
    name: "Kiến trúc & Kỹ thuật Xây dựng",
    code: "7580101",
    group: "Công nghệ - Kỹ thuật",
    groupKey: "tech",
    blocks: "V00, V01, A00, A01",
    score: "21.5 – 26.0",
    universities: "ĐH Kiến trúc HN, ĐH Kiến trúc TP.HCM, ĐH Xây dựng HN, ĐH Bách Khoa TP.HCM",
    description: "Kết hợp nghệ thuật tổ chức không gian và kỹ thuật kết cấu công trình để thiết kế nhà ở, nội thất, cảnh quan và quy hoạch đô thị.",
    subjects: "Đồ án thiết kế kiến trúc, Sức bền vật liệu, Kết cấu công trình, Quy hoạch đô thị, Công nghệ BIM (Revit, AutoCAD).",
    careers: "Kiến trúc sư công trình/nội thất, Kỹ sư kết cấu, Kỹ sư BIM, Quản lý dự án xây dựng.",
    salary: "10 – 17 triệu/tháng (mới ra trường); 22 – 50+ triệu/tháng (Kiến trúc sư chủ trì)",
    notes: "Ngành Kiến trúc thường xét tuyển khối V00/V01 (có môn Vẽ mỹ thuật); Kỹ thuật xây dựng xét A00/A01."
  },
  {
    stt: 8,
    id: "qtkd",
    name: "Quản trị kinh doanh (Business Administration)",
    code: "7340101",
    group: "Kinh tế - Quản trị",
    groupKey: "biz",
    blocks: "A00, A01, D01, D07",
    score: "24.0 – 27.5",
    universities: "ĐH Ngoại thương (FTU), ĐH Kinh tế Quốc dân (NEU), ĐH Kinh tế TP.HCM (UEH), ĐH Thương mại",
    description: "Đào tạo toàn diện phương pháp vận hành doanh nghiệp: hoạch định chiến lược, quản trị nhân sự, tài chính, vận hành và khởi nghiệp.",
    subjects: "Kinh tế vi mô & vĩ mô, Quản trị chiến lược, Quản trị nhân sự, Quản trị tài chính, Quản trị dự án & Khởi nghiệp.",
    careers: "Management Trainee (Quản trị viên tập sự), Chuyên viên phát triển kinh doanh (BD), Quản lý dự án, HR, Startup Founder.",
    salary: "9 – 16 triệu/tháng (mới ra trường); 20 – 50+ triệu/tháng (Cấp quản lý)",
    notes: "Phù hợp với người năng động, giao tiếp tốt, có tư duy tổ chức và định hướng lãnh đạo."
  },
  {
    stt: 9,
    id: "marketing",
    name: "Marketing & Tiếp thị số (Digital Marketing)",
    code: "7340115",
    group: "Kinh tế - Quản trị",
    groupKey: "biz",
    blocks: "A00, A01, D01, C00",
    score: "25.0 – 28.0",
    universities: "ĐH Kinh tế Quốc dân (NEU), ĐH Kinh tế TP.HCM (UEH), ĐH Tài chính - Marketing (UFM), ĐH Ngoại thương, ĐH Thương mại",
    description: "Nghiên cứu thị trường, phân tích hành vi người tiêu dùng, quản trị thương hiệu (Branding) và triển khai chiến dịch Digital Marketing.",
    subjects: "Nguyên lý Marketing, Hành vi người tiêu dùng, Quản trị thương hiệu, Digital Marketing (SEO, Ads, Social), Truyền thông IMC.",
    careers: "Digital Marketer, Brand Executive, Content Creator/Copywriter, Trade Marketing, Strategic Planner tại Agency.",
    salary: "9 – 15 triệu/tháng (mới ra trường); 18 – 45 triệu/tháng (Marketing Manager)",
    notes: "Kết hợp giữa tư duy sáng tạo nội dung và khả năng đọc hiểu dữ liệu đo lường hiệu quả chiến dịch."
  },
  {
    stt: 10,
    id: "logistics",
    name: "Logistics và Quản lý chuỗi cung ứng",
    code: "7510605",
    group: "Kinh tế - Quản trị",
    groupKey: "biz",
    blocks: "A00, A01, D01, D07",
    score: "25.5 – 28.2",
    universities: "ĐH Ngoại thương (FTU), ĐH Kinh tế Quốc dân (NEU), ĐH Kinh tế TP.HCM (UEH), ĐH Giao thông Vận tải, ĐH Hàng hải",
    description: "Quản lý tối ưu dòng chảy hàng hóa từ thu mua nguyên liệu, kho vận, vận tải đa phương thức quốc tế đến thủ tục hải quan xuất nhập khẩu.",
    subjects: "Quản trị chuỗi cung ứng, Vận tải đa phương thức, Nghiệp vụ Hải quan & Xuất nhập khẩu, Quản trị thu mua & Kho vận.",
    careers: "Chuyên viên Xuất nhập khẩu, Chuyên viên Thu mua quốc tế (Procurement), Điều phối vận tải, Supply Chain Planner.",
    salary: "10 – 17 triệu/tháng (mới ra trường); 20 – 45 triệu/tháng (Supply Chain Manager)",
    notes: "Năng lực ngoại ngữ (Anh, Trung, Hàn, Nhật) và tư duy tối ưu hóa quy trình là lợi thế cạnh tranh lớn."
  },
  {
    stt: 11,
    id: "tcnh",
    name: "Tài chính - Ngân hàng & Công nghệ tài chính (Fintech)",
    code: "7340201",
    group: "Kinh tế - Quản trị",
    groupKey: "biz",
    blocks: "A00, A01, D01, D07",
    score: "24.0 – 27.2",
    universities: "Học viện Ngân hàng, Học viện Tài chính, ĐH Kinh tế Quốc dân, ĐH Ngân hàng TP.HCM, ĐH Kinh tế TP.HCM",
    description: "Nghiên cứu sự vận động của dòng vốn, thị trường chứng khoán, đầu tư tài chính, nghiệp vụ ngân hàng thương mại và Fintech.",
    subjects: "Tài chính doanh nghiệp, Nghiệp vụ Ngân hàng thương mại, Đầu tư chứng khoán, Quản trị rủi ro, Công nghệ tài chính (Fintech).",
    careers: "Chuyên viên Ngân hàng, Chuyên viên phân tích đầu tư chứng khoán/quỹ, Quản trị tài chính doanh nghiệp, Chuyên viên Fintech.",
    salary: "10 – 18 triệu/tháng (mới ra trường); 22 – 60+ triệu/tháng (Chuyên gia đầu tư)",
    notes: "Phù hợp với học sinh nhạy bén với số liệu, tư duy phân tích định lượng và tính cẩn trọng cao."
  },
  {
    stt: 12,
    id: "ke_toan_kiem_toan",
    name: "Kế toán - Kiểm toán (Accounting & Auditing)",
    code: "7340301",
    group: "Kinh tế - Quản trị",
    groupKey: "biz",
    blocks: "A00, A01, D01",
    score: "24.0 – 27.5",
    universities: "ĐH Kinh tế Quốc dân (NEU), Học viện Tài chính (AOF), ĐH Kinh tế TP.HCM (UEH), ĐH Ngoại thương",
    description: "Đào tạo chuyên gia ghi nhận, kiểm toán và phân tích báo cáo tài chính, thuế và kiểm soát nội bộ theo chuẩn mực Việt Nam và quốc tế (IFRS).",
    subjects: "Nguyên lý kế toán, Kế toán tài chính & Quản trị, Kiểm toán báo cáo tài chính, Kế toán thuế, Chuẩn mực quốc tế ACCA/IFRS.",
    careers: "Kiểm toán viên (Big4: Deloitte, PwC, EY, KPMG), Kế toán tổng hợp, Kế toán trưởng, Chuyên viên tư vấn thuế.",
    salary: "8 – 15 triệu/tháng (mới ra trường); 20 – 50 triệu/tháng (Kế toán trưởng / Senior Auditor)",
    notes: "Nhu cầu tuyển dụng luôn ổn định tại mọi doanh nghiệp, ngân hàng và tổ chức kiểm toán."
  },
  {
    stt: 13,
    id: "tm_dien_tu",
    name: "Thương mại điện tử (E-Commerce)",
    code: "7340122",
    group: "Kinh tế - Quản trị",
    groupKey: "biz",
    blocks: "A00, A01, D01, D07",
    score: "24.5 – 27.6",
    universities: "ĐH Thương mại (TMU), ĐH Kinh tế Quốc dân, ĐH Kinh tế TP.HCM, ĐH CNTT (ĐHQG TP.HCM), ĐH Kinh tế - Luật",
    description: "Giao thoa giữa Kinh doanh số, Marketing và CNTT để xây dựng, vận hành sàn TMĐT, thanh toán điện tử và phân tích dữ liệu khách hàng.",
    subjects: "Mô hình kinh doanh số, Quản trị sàn TMĐT, Tiếp thị số, Phát triển Web/App TMĐT, E-Logistics & Phân tích dữ liệu.",
    careers: "Chuyên viên phát triển sàn TMĐT (E-commerce Executive/KAM), Quản trị kinh doanh số tại nhãn hàng, Khởi nghiệp kinh doanh số.",
    salary: "9 – 16 triệu/tháng (mới ra trường); 20 – 45 triệu/tháng (E-commerce Manager)",
    notes: "Phù hợp với học sinh muốn kết hợp kiến thức quản trị kinh doanh với công nghệ số hiện đại."
  },
  {
    stt: 14,
    id: "kinh_doanh_quoc_te",
    name: "Kinh doanh quốc tế (International Business)",
    code: "7340120",
    group: "Kinh tế - Quản trị",
    groupKey: "biz",
    blocks: "A00, A01, D01, D07",
    score: "25.5 – 28.5",
    universities: "ĐH Ngoại thương (FTU), ĐH Kinh tế Quốc dân (NEU), ĐH Kinh tế TP.HCM (UEH), ĐH Kinh tế - Luật, Học viện Ngoại giao",
    description: "Đào tạo về thương mại toàn cầu, đầu tư quốc tế, đàm phán thương mại đa văn hóa và chiến lược phát triển thị trường của các tập đoàn đa quốc gia.",
    subjects: "Kinh doanh quốc tế, Giao dịch thương mại quốc tế, Thanh toán quốc tế, Đàm phán đa văn hóa, Luật thương mại quốc tế.",
    careers: "Chuyên viên kinh doanh quốc tế, Quản trị chuỗi cung ứng toàn cầu, Phát triển thị trường nước ngoài tại các tập đoàn FDI/MNCs.",
    salary: "10 – 18 triệu/tháng (mới ra trường); 25 – 55 triệu/tháng (Quản lý khu vực)",
    notes: "Yêu cầu khả năng ngoại ngữ tốt và bản lĩnh làm việc trong môi trường kinh doanh xuyên biên giới."
  },
  {
    stt: 15,
    id: "quan_tri_khach_san_du_lich",
    name: "Quản trị dịch vụ Du lịch, Lữ hành & Khách sạn",
    code: "7810103",
    group: "Kinh tế - Quản trị",
    groupKey: "biz",
    blocks: "D01, A00, A01, C00",
    score: "23.0 – 26.8",
    universities: "ĐH Kinh tế Quốc dân, ĐH Thương mại, ĐH KHXH&NV (ĐHQG HN & TP.HCM), ĐH Kinh tế TP.HCM, ĐH Hà Nội",
    description: "Đào tạo nghiệp vụ quản lý chuỗi khách sạn - Resort 5 sao, thiết kế điều hành tour lữ hành, tổ chức hội nghị sự kiện (MICE) và dịch vụ F&B.",
    subjects: "Quản trị lữ hành & Thiết kế Tour, Quản trị khách sạn & Resort, Quản trị dịch vụ Ẩm thực (F&B), Tổ chức sự kiện MICE.",
    careers: "Quản lý khách sạn/Resort quốc tế (Marriott, Accor, InterContinental, Vinpearl), Điều hành tour, Chuyên viên sự kiện MICE.",
    salary: "8 – 15 triệu/tháng + Service Charge (mới ra trường); 20 – 45 triệu/tháng (Quản lý/GM)",
    notes: "Phù hợp với người giao tiếp tinh tế, giỏi ngoại ngữ và yêu thích lĩnh vực dịch vụ hiếu khách (Hospitality)."
  },
  {
    stt: 16,
    id: "y_da_khoa",
    name: "Y khoa (Bác sĩ Đa khoa - General Medicine)",
    code: "7720101",
    group: "Y Dược - Sức khỏe",
    groupKey: "med",
    blocks: "B00, A00, D08",
    score: "25.5 – 28.5",
    universities: "ĐH Y Hà Nội (HMU), ĐH Y Dược TP.HCM (UMP), ĐH Y khoa Phạm Ngọc Thạch, ĐH Y Dược Huế, ĐH Y Dược (ĐHQG HN)",
    description: "Đào tạo Bác sĩ đa khoa (chương trình 6 năm) về y học cơ sở, y học lâm sàng, chẩn đoán, phẫu thuật, điều trị và dự phòng bệnh tật.",
    subjects: "Giải phẫu học, Sinh lý học, Dược lý, Nội khoa, Ngoại khoa, Sản phụ khoa, Nhi khoa, Thực hành lâm sàng bệnh viện.",
    careers: "Bác sĩ khám và điều trị tại bệnh viện công lập/quốc tế, Bác sĩ nội trú, Bác sĩ chuyên khoa sâu, Giảng viên y khoa.",
    salary: "10 – 20 triệu/tháng (mới ra trường); 30 – 100+ triệu/tháng (Bác sĩ chuyên khoa giỏi)",
    notes: "Đòi hỏi năng lực học tập xuất sắc ở tổ hợp B00 (Toán, Hóa, Sinh), y đức và sự bền bỉ rèn luyện lâu dài."
  },
  {
    stt: 17,
    id: "duoc_hoc",
    name: "Dược học (Dược sĩ Đại học - Pharmacy)",
    code: "7720201",
    group: "Y Dược - Sức khỏe",
    groupKey: "med",
    blocks: "A00, B00, D07",
    score: "23.5 – 26.5",
    universities: "ĐH Dược Hà Nội (HUP), ĐH Y Dược TP.HCM (UMP), ĐH Y Dược (ĐHQG HN), ĐH Y Dược Cần Thơ",
    description: "Đào tạo Dược sĩ đại học (5 năm) chuyên sâu về nghiên cứu bào chế, sản xuất, kiểm nghiệm chất lượng thuốc, dược lâm sàng và quản lý dược.",
    subjects: "Hóa dược, Dược lý học, Bào chế & Sinh dược học, Dược lâm sàng, Kiểm nghiệm thuốc & Quản lý kinh tế dược.",
    careers: "Dược sĩ lâm sàng bệnh viện, Chuyên viên R&D bào chế thuốc, Quản lý sản phẩm tại tập đoàn dược đa quốc gia, Quản lý chuỗi nhà thuốc.",
    salary: "10 – 18 triệu/tháng (mới ra trường); 20 – 50 triệu/tháng (Quản lý dược / R&D)",
    notes: "Phù hợp với học sinh giỏi Hóa học và Sinh học, cẩn thận, chính xác trong nghiên cứu phòng Lab và lâm sàng."
  },
  {
    stt: 18,
    id: "luat",
    name: "Luật & Luật Kinh tế (Law & Economic Law)",
    code: "7380101",
    group: "Xã hội - Ngôn ngữ - Luật",
    groupKey: "law",
    blocks: "A00, A01, C00, D01",
    score: "24.0 – 28.5",
    universities: "ĐH Luật Hà Nội (HLU), ĐH Luật TP.HCM (ULAW), ĐH Luật (ĐHQG HN), ĐH Kinh tế - Luật (UEL), ĐH Kinh tế Quốc dân",
    description: "Nghiên cứu hệ thống pháp luật Việt Nam và quốc tế (dân sự, hình sự, thương mại, đầu tư), kỹ năng lập luận pháp lý, soạn thảo hợp đồng và tranh tụng.",
    subjects: "Luật Hiến pháp, Luật Dân sự, Luật Hình sự, Luật Thương mại & Đầu tư, Pháp luật Thương mại Quốc tế, Kỹ năng tranh tụng.",
    careers: "Luật sư tại Law Firm, Chuyên viên Pháp chế doanh nghiệp (In-house Counsel), Thẩm phán, Kiểm sát viên, Công chứng viên.",
    salary: "9 – 16 triệu/tháng (mới ra trường); 25 – 70+ triệu/tháng (Luật sư chính / Trưởng phòng pháp chế)",
    notes: "Cần tư duy phản biện chặt chẽ, lập luận logic sắc bén, trí nhớ tốt và tinh thần thượng tôn pháp luật."
  },
  {
    stt: 19,
    id: "ngon_ngu_anh",
    name: "Ngôn ngữ Anh & Biên phiên dịch quốc tế",
    code: "7220201",
    group: "Xã hội - Ngôn ngữ - Luật",
    groupKey: "law",
    blocks: "D01, D14, D15",
    score: "24.0 – 27.5",
    universities: "ĐH Ngoại ngữ - ĐHQG HN (ULIS), ĐH Hà Nội (HANU), ĐH KHXH&NV (ĐHQG TP.HCM), Học viện Ngoại giao, ĐH Ngoại thương",
    description: "Đào tạo chuyên sâu tiếng Anh học thuật (C1/C2), biên - phiên dịch hội nghị/cabin, tiếng Anh thương mại - ngoại giao và phương pháp giảng dạy TESOL.",
    subjects: "Thực hành tiếng Anh C1/C2, Biên dịch - Phiên dịch cabin, Tiếng Anh Thương mại & Ngoại giao, Phương pháp giảng dạy TESOL.",
    careers: "Biên phiên dịch viên quốc tế/ngoại giao, Chuyên viên đối ngoại tại tập đoàn đa quốc gia, Giảng viên tiếng Anh/IELTS.",
    salary: "10 – 18 triệu/tháng (mới ra trường); 20 – 50 triệu/tháng (Phiên dịch cabin / Quản lý đối ngoại)",
    notes: "Phù hợp với học sinh có năng khiếu ngoại ngữ, phản xạ giao tiếp tốt và yêu thích môi trường quốc tế."
  },
  {
    stt: 20,
    id: "thiet_ke_truyen_thong",
    name: "Thiết kế đồ họa & Truyền thông đa phương tiện",
    code: "7210403",
    group: "Nghệ thuật - Truyền thông",
    groupKey: "art",
    blocks: "H00, V00, D01, C00",
    score: "22.0 – 27.5",
    universities: "Học viện Báo chí & Tuyên truyền, PTIT, ĐH Mỹ thuật Công nghiệp, ĐH Kiến trúc, ĐH FPT, ĐH Văn Lang",
    description: "Kết hợp mỹ thuật ứng dụng, công nghệ số và truyền thông: thiết kế nhận diện thương hiệu, giao diện Web/App (UI/UX), sản xuất video và 2D/3D.",
    subjects: "Mỹ thuật cơ sở & Typography, Thiết kế thương hiệu (Branding), Thiết kế UI/UX, Motion Graphics & 3D, Sản xuất Video số.",
    careers: "Graphic Designer, UI/UX Designer, Motion/3D Artist, Video Producer, Creative Planner tại Agency và công ty công nghệ.",
    salary: "9 – 16 triệu/tháng (mới ra trường); 20 – 50+ triệu/tháng (Senior UI/UX hoặc Art Director)",
    notes: "Dành cho học sinh có thẩm mỹ thị giác tốt, giàu ý tưởng sáng tạo và yêu thích sản xuất nội dung số."
  }
];

const CONFIG = {
  system_name: "UniGuide VN",
  bot_name: "UniBot",
  out_of_scope_message: "Xin lỗi bạn, UniBot hiện chỉ hỗ trợ tư vấn hướng nghiệp và giải đáp thông tin học thuật về các ngành đại học tại Việt Nam. Bạn hãy đặt câu hỏi về ngành học, khối thi hoặc trường đại học để mình hỗ trợ nhé!"
};

let currentGroup = "ALL";
let savedApiKey = (localStorage.getItem("UNIGUIDE_GEMINI_API_KEY") || FALLBACK_GEMINI_API_KEY || "").trim();
let storedModel = localStorage.getItem("UNIGUIDE_GEMINI_MODEL") || "";
if (storedModel.includes("2.5") || storedModel.includes("2.0") || storedModel.includes("1.5")) {
  storedModel = "";
  localStorage.removeItem("UNIGUIDE_GEMINI_MODEL");
}
let activeModelName = storedModel || "gemini-3.1-flash-lite";

function sanitizeApiKey(raw) {
  return (raw || "").replace(/['"\s]/g, "").trim();
}

function getEffectiveApiKey() {
  return sanitizeApiKey(savedApiKey) || sanitizeApiKey(FALLBACK_GEMINI_API_KEY);
}

// ============================================================================
// 2. HIỂN THỊ DANH SÁCH HỌC THUẬT (CHẾ ĐỘ BẢNG DANH SÁCH DUY NHẤT)
// ============================================================================
function syncCategoryActiveState() {
  document.querySelectorAll("#categoryTabs .cat-tab").forEach(btn => {
    btn.classList.toggle("active", btn.getAttribute("data-cat") === currentGroup);
  });
}

function selectCategory(group) {
  currentGroup = group;
  syncCategoryActiveState();
  renderCatalog();
}

function getFilteredMajors() {
  const keyword = document.getElementById("searchInput").value.trim().toLowerCase();
  const block = document.getElementById("blockSelect").value;

  return MAJORS_DATA.filter(item => {
    const matchGroup = currentGroup === "ALL" || item.group === currentGroup;
    const matchBlock =
      block === "ALL" ||
      item.blocks.includes(block) ||
      (block === "V00" && (item.blocks.includes("V00") || item.blocks.includes("H00")));
    const searchable = `${item.name} ${item.code} ${item.group} ${item.universities} ${item.description} ${item.careers}`.toLowerCase();
    const matchKeyword = !keyword || searchable.includes(keyword);
    return matchGroup && matchBlock && matchKeyword;
  });
}

function renderCatalog() {
  const filtered = getFilteredMajors();
  const container = document.getElementById("catalogContainer");
  document.getElementById("catalogCount").textContent = `Hiển thị ${String(filtered.length).padStart(2, "0")} / ${MAJORS_DATA.length} ngành đào tạo`;

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="background:#fff; border:1px solid var(--border-light); border-radius:8px; padding:2.5rem; text-align:center; color:var(--ink-secondary);">
        Không tìm thấy ngành đào tạo nào khớp với điều kiện tra cứu hiện tại.
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div class="majors-table-wrap">
      <table class="academic-table">
        <thead>
          <tr>
            <th>STT</th>
            <th>Mã ngành</th>
            <th>Tên ngành đào tạo</th>
            <th>Lĩnh vực</th>
            <th>Tổ hợp</th>
            <th>Điểm chuẩn</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          ${filtered.map(item => `
            <tr>
              <td style="font-family:var(--font-mono); color:var(--ink-muted);">${String(item.stt).padStart(2, "0")}</td>
              <td><span class="code-badge">${item.code}</span></td>
              <td>
                <strong style="color:var(--ink-primary); display:block;">${item.name}</strong>
                <span style="font-size:0.76rem; color:var(--ink-muted);">${item.universities.split(",").slice(0, 2).join(", ")}...</span>
              </td>
              <td><span class="group-tag ${item.groupKey}">${item.group}</span></td>
              <td style="font-family:var(--font-mono); font-size:0.78rem;">${item.blocks}</td>
              <td style="font-family:var(--font-mono); font-size:0.78rem; font-weight:600;">${item.score}</td>
              <td>
                <div style="display:flex; gap:0.4rem;">
                  <button type="button" class="btn btn-secondary" style="padding:0.32rem 0.6rem; font-size:0.76rem;" onclick="openSyllabusModal(${item.stt})">Chi tiết</button>
                  <button type="button" class="btn btn-primary" style="padding:0.32rem 0.6rem; font-size:0.76rem;" onclick="askAdvisorAboutMajor(${item.stt})">Hỏi AI</button>
                </div>
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

// ============================================================================
// 3. MODAL ĐỀ CƯƠNG CHI TIẾT NGÀNH HỌC
// ============================================================================
function openSyllabusModal(stt) {
  const item = MAJORS_DATA.find(m => m.stt === stt);
  if (!item) return;

  document.getElementById("modalGroupTag").className = `group-tag ${item.groupKey}`;
  document.getElementById("modalGroupTag").textContent = item.group;
  document.getElementById("modalTitle").textContent = `${item.name}`;
  document.getElementById("modalCodeMeta").textContent = `Mã ngành tuyển sinh: ${item.code}  |  Tổ hợp môn: ${item.blocks}  |  Điểm chuẩn: ${item.score} điểm`;

  document.getElementById("modalSyllabusBody").innerHTML = `
    <div class="syllabus-block">
      <span class="syllabus-block-label">01. Tổng quan chương trình đào tạo</span>
      <div class="syllabus-block-text">${item.description}</div>
    </div>
    <div class="syllabus-block">
      <span class="syllabus-block-label">02. Học phần & Kiến thức cốt lõi</span>
      <div class="syllabus-block-text">${item.subjects}</div>
    </div>
    <div class="syllabus-block">
      <span class="syllabus-block-label">03. Các trường Đại học đào tạo tiêu biểu tại Việt Nam</span>
      <div class="syllabus-block-text">${item.universities}</div>
    </div>
    <div class="syllabus-block">
      <span class="syllabus-block-label">04. Vị trí việc làm & Lộ trình thu nhập</span>
      <div class="syllabus-block-text">
        <p style="margin-bottom:0.35rem;"><strong>Vị trí công việc:</strong> ${item.careers}</p>
        <p><strong>Mức lương tham khảo:</strong> ${item.salary}</p>
      </div>
    </div>
    <div class="syllabus-block">
      <span class="syllabus-block-label">05. Yêu cầu năng lực & Tố chất phù hợp</span>
      <div class="syllabus-block-text">${item.notes}</div>
    </div>
  `;

  const askBtn = document.getElementById("modalAskBtn");
  askBtn.onclick = () => {
    closeSyllabusModal();
    askAdvisorAboutMajor(item.stt);
  };

  document.getElementById("syllabusModal").classList.add("open");
}

function closeSyllabusModal() {
  document.getElementById("syllabusModal").classList.remove("open");
}

function askAdvisorAboutMajor(stt) {
  const item = MAJORS_DATA.find(m => m.stt === stt);
  if (!item) return;
  const q = `Phân tích chi tiết ngành ${item.name} (mã ngành ${item.code}): cần học tốt môn gì, học trường nào tốt nhất và cơ hội nghề nghiệp sau khi ra trường?`;
  askPreset(q);
}

// ============================================================================
// 4. LOGIC AI CONTEXT INJECTION & SYSTEM INSTRUCTION (TƯƠNG THÍCH MỌI MODEL GEMINI)
// ============================================================================
function buildMajorsContext() {
  return MAJORS_DATA.map(row =>
    `${row.stt}. Ngành ${row.name} (Mã ngành: ${row.code} | Nhóm: ${row.group}): ${row.description} Môn học chính: ${row.subjects} Khối xét tuyển: ${row.blocks}. Điểm chuẩn tham khảo: ${row.score}. Trường đào tạo tiêu biểu: ${row.universities}. Cơ hội việc làm: ${row.careers} Mức lương tham khảo: ${row.salary}. Ghi chú/Tố chất: ${row.notes}`
  ).join("\n");
}

function buildSystemInstruction() {
  return `Bạn tên là ${CONFIG.bot_name}, cố vấn học thuật và hướng nghiệp AI của hệ thống ${CONFIG.system_name}.
Quy tắc trả lời BẮT BUỘC:
1. Luôn trả lời bằng tiếng Việt chuẩn mực, rõ ràng, mang tính học thuật và định hướng thực tế cho học sinh - sinh viên.
2. Chỉ tư vấn dựa trên danh sách 20 ngành học trong dữ liệu ngữ cảnh được cung cấp. Tuyệt đối KHÔNG tự bịa ra mã ngành hoặc thông tin ngoài dữ liệu.
3. Khi phân tích một ngành học, trình bày rõ theo cấu trúc: Tên ngành (Mã ngành), Tổ hợp xét tuyển & Điểm chuẩn, Trường đào tạo tiêu biểu, Chương trình học và Cơ hội việc làm.
4. Nếu người dùng hỏi những câu nằm NGOÀI phạm vi ngành học đại học / tuyển sinh / hướng nghiệp (ví dụ: hỏi công thức nấu ăn, thời tiết, mua điện thoại, chơi game...), hãy trả lời ĐÚNG câu sau:
   "${CONFIG.out_of_scope_message}"
5. Giữ câu trả lời mạch lạc, súc tích, dễ đọc.`;
}

function formatMarkdown(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/`(.*?)`/g, "<code>$1</code>")
    .replace(/\n/g, "<br>");
}

function appendChatBubble(text, isUser = false) {
  const feed = document.getElementById("chatFeed");
  const div = document.createElement("div");
  div.className = `chat-bubble ${isUser ? "user" : "bot"}`;
  div.innerHTML = isUser ? text.replace(/</g, "&lt;") : formatMarkdown(text);
  feed.appendChild(div);
  feed.scrollTop = feed.scrollHeight;
  return div;
}

function askPreset(question) {
  const input = document.getElementById("chatInput");
  input.value = question;
  handleChatSubmit(new Event("submit"));
}

function resetChat() {
  document.getElementById("chatFeed").innerHTML = `
    <div class="chat-bubble bot">
      Đã làm mới phiên tư vấn học thuật. Bạn hãy nhập câu hỏi về khối thi, điểm chuẩn, chương trình đào tạo hoặc cơ hội nghề nghiệp của 20 ngành đại học tại Việt Nam.
    </div>
  `;
}

// Tự động tìm model Gemini 3.x Flash Lite / Flash khả dụng cho API Key của người dùng
async function resolveAvailableGeminiModel(cleanKey) {
  const preferred = [
    "gemini-3.1-flash-lite",
    "gemini-3.1-flash-lite-preview",
    "gemini-3.5-flash-lite",
    "gemini-3.5-flash-lite-preview",
    "gemini-3.6-flash-lite",
    "gemini-3.8-flash-lite",
    "gemini-3.6-flash",
    "gemini-3.8-flash",
    "gemini-3.5-flash",
    "gemini-3.1-flash"
  ];
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(cleanKey)}`);
  const data = await res.json();

  if (!res.ok) {
    const errMsg = data?.error?.message || `HTTP ${res.status}`;
    throw new Error(errMsg);
  }

  // Lọc danh sách các model hỗ trợ generateContent và loại bỏ các bản cũ (1.x, 2.x đã ngừng hỗ trợ user mới)
  const available = (data.models || [])
    .filter(m => Array.isArray(m.supportedGenerationMethods) && m.supportedGenerationMethods.includes("generateContent"))
    .map(m => m.name.replace(/^models\//, ""))
    .filter(name => !name.includes("1.5") && !name.includes("2.0") && !name.includes("2.5"));

  // 1. Ưu tiên khớp chính xác danh sách 3.1 flash lite / 3.5 flash lite
  for (const cand of preferred) {
    if (available.includes(cand)) return cand;
  }

  // 2. Tìm bất kỳ model 3.x flash-lite nào có trong tài khoản
  const flashLite3x = available.find(name => (name.includes("3.1") || name.includes("3.5") || name.includes("3.")) && name.includes("lite"));
  if (flashLite3x) return flashLite3x;

  // 3. Tìm bất kỳ model 3.x flash nào có trong tài khoản
  const flash3x = available.find(name => name.includes("3.") && name.includes("flash"));
  if (flash3x) return flash3x;

  return available[0] || "gemini-3.1-flash-lite";
}

// Gọi trực tiếp Gemini REST API với ưu tiên Gemini 3.1 Flash Lite / 3.5 Flash Lite
async function callGeminiDirect(question, rawKey) {
  const cleanKey = sanitizeApiKey(rawKey);
  if (!cleanKey) throw new Error("Chưa có API Key");

  const combinedPrompt = `${buildSystemInstruction()}

====================================================================
DỮ LIỆU NGỮ CẢNH 20 NGÀNH HỌC ĐẠI HỌC TẠI VIỆT NAM (CONTEXT INJECTION):
${buildMajorsContext()}
====================================================================

CÂU HỎI CỦA HỌC SINH / NGƯỜI DÙNG:
"${question}"

HÃY TRẢ LỜI THEO ĐÚNG VAI TRÒ UNIBOT VÀ QUY TẮC TRÊN:`;

  // Xác thực danh sách model thực tế trên tài khoản để ưu tiên 3.1-flash-lite / 3.5-flash-lite
  let discoveredModel = activeModelName;
  try {
    discoveredModel = await resolveAvailableGeminiModel(cleanKey);
  } catch (_) {}

  const candidateModels = Array.from(new Set([
    discoveredModel,
    "gemini-3.1-flash-lite",
    "gemini-3.1-flash-lite-preview",
    "gemini-3.5-flash-lite",
    "gemini-3.5-flash-lite-preview",
    "gemini-3.6-flash",
    "gemini-3.8-flash"
  ]));

  let lastError = null;

  for (const modelName of candidateModels) {
    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${encodeURIComponent(cleanKey)}`;
      const resp = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: combinedPrompt }]
            }
          ],
          generationConfig: {
            temperature: 0.3
          }
        })
      });

      const data = await resp.json();
      if (resp.ok && data?.candidates?.[0]?.content?.parts?.[0]?.text) {
        activeModelName = modelName;
        localStorage.setItem("UNIGUIDE_GEMINI_MODEL", modelName);
        updateApiStatusBadge();
        return data.candidates[0].content.parts[0].text;
      }

      lastError = data?.error?.message || `HTTP ${resp.status}`;

      // Nếu thông báo lỗi của Google gợi ý tên model mới (VD: models/gemini-3.8-flash), tự động bắt lấy và gọi ngay
      const suggestedMatch = lastError.match(/models\/([a-zA-Z0-9._-]+)/);
      if (suggestedMatch && suggestedMatch[1] && !candidateModels.includes(suggestedMatch[1])) {
        candidateModels.push(suggestedMatch[1]);
      }

      if (resp.status === 400 && lastError.toLowerCase().includes("api key not valid")) {
        throw new Error(lastError);
      }
    } catch (err) {
      lastError = err.message || String(err);
    }
  }

  throw new Error(lastError || "Không gọi được Gemini API");
}

function localAcademicFallback(question) {
  const q = question.toLowerCase().trim();

  // 1. Kiểm tra câu hỏi ngoài phạm vi tư vấn đại học / hướng nghiệp (Anti-hallucination / Out-of-scope)
  const outOfScopeKeywords = [
    "nấu ăn", "công thức", "phở", "bún bò", "thời tiết", "bóng đá",
    "chơi game", "mua điện thoại", "xổ số", "xem bói", "người yêu", "ca sĩ"
  ];
  if (outOfScopeKeywords.some(kw => q.includes(kw))) {
    return CONFIG.out_of_scope_message;
  }

  // 2. Bảng từ khóa đồng nghĩa thông minh cho 20 ngành học
  const aliasMap = [
    { stt: 1, keys: ["it", "cntt", "công nghệ thông tin", "lập trình", "phần mềm", "web", "code", "máy tính"] },
    { stt: 2, keys: ["ai", "trí tuệ nhân tạo", "khoa học dữ liệu", "data", "machine learning", "dữ liệu"] },
    { stt: 3, keys: ["an toàn thông tin", "an ninh mạng", "bảo mật", "cyber", "hacker", "pentest"] },
    { stt: 4, keys: ["vi mạch", "bán dẫn", "điện tử", "viễn thông", "chip", "iot", "nhúng"] },
    { stt: 5, keys: ["tự động hóa", "điều khiển", "cơ điện tử", "robot", "plc"] },
    { stt: 6, keys: ["ô tô", "xe điện", "ev", "cơ khí động lực", "vinfast"] },
    { stt: 7, keys: ["kiến trúc", "xây dựng", "nội thất", "công trình", "v00"] },
    { stt: 8, keys: ["quản trị kinh doanh", "qtkd", "kinh doanh", "khởi nghiệp", "ceo"] },
    { stt: 9, keys: ["marketing", "digital marketing", "truyền thông", "quảng cáo", "thương hiệu", "content"] },
    { stt: 10, keys: ["logistics", "chuỗi cung ứng", "xuất nhập khẩu", "hải quan", "vận tải", "supply chain"] },
    { stt: 11, keys: ["tài chính", "ngân hàng", "fintech", "chứng khoán", "đầu tư"] },
    { stt: 12, keys: ["kế toán", "kiểm toán", "thuế", "big4"] },
    { stt: 13, keys: ["thương mại điện tử", "tmđt", "ecommerce", "e-commerce", "shopee", "tiktok"] },
    { stt: 14, keys: ["kinh doanh quốc tế", "ngoại thương", "đa quốc gia", "ftu"] },
    { stt: 15, keys: ["du lịch", "lữ hành", "khách sạn", "nhà hàng", "resort", "mice"] },
    { stt: 16, keys: ["y khoa", "bác sĩ", "đa khoa", "y dược", "bệnh viện", "b00"] },
    { stt: 17, keys: ["dược", "dược sĩ", "thuốc", "bào chế"] },
    { stt: 18, keys: ["luật", "luật sư", "pháp lý", "pháp chế", "tòa án"] },
    { stt: 19, keys: ["ngôn ngữ anh", "tiếng anh", "biên dịch", "phiên dịch", "ielts", "ngoại ngữ"] },
    { stt: 20, keys: ["thiết kế đồ họa", "đồ họa", "ui/ux", "đa phương tiện", "design", "mỹ thuật"] }
  ];

  const words = q.split(/[\s,?.!;:()]+/).filter(Boolean);
  let matchedStts = [];

  aliasMap.forEach(entry => {
    for (const k of entry.keys) {
      if (k.length <= 3) {
        if (words.includes(k)) {
          matchedStts.push(entry.stt);
          break;
        }
      } else if (q.includes(k)) {
        matchedStts.push(entry.stt);
        break;
      }
    }
  });

  // Lọc thêm theo khối thi nếu câu hỏi nhắc tới A00, A01, D01, B00, C00...
  const blockMatches = ["a00", "a01", "d01", "d07", "b00", "c00", "v00", "h00"].filter(b => q.includes(b));
  let matched = MAJORS_DATA.filter(m => matchedStts.includes(m.stt));

  if (matched.length === 0 && blockMatches.length > 0) {
    const targetBlock = blockMatches[0].toUpperCase();
    matched = MAJORS_DATA.filter(m => m.blocks.toUpperCase().includes(targetBlock)).slice(0, 4);
  }

  if (matched.length === 0) {
    matched = MAJORS_DATA.filter(m => {
      const searchable = `${m.name} ${m.code} ${m.group} ${m.blocks} ${m.universities} ${m.description} ${m.careers}`.toLowerCase();
      return words.some(w => w.length >= 3 && searchable.includes(w));
    }).slice(0, 3);
  }

  const list = matched.length ? matched.slice(0, 3) : MAJORS_DATA.slice(0, 3);

  if (list.length === 1) {
    const m = list[0];
    return `Chào bạn! **UniBot** xin cung cấp hồ sơ phân tích học thuật chi tiết cho ngành **${m.name}**:\n\n` +
      `• **Mã ngành tuyển sinh:** \`${m.code}\` (${m.group})\n` +
      `• **Tổ hợp xét tuyển & Điểm chuẩn:** Khối **${m.blocks}** — Điểm chuẩn tham khảo: **${m.score} điểm**\n` +
      `• **Chương trình đào tạo:** ${m.description}\n` +
      `• **Các học phần cốt lõi:** ${m.subjects}\n` +
      `• **Trường Đại học đào tạo tiêu biểu:** ${m.universities}\n` +
      `• **Vị trí việc làm & Mức lương:** ${m.careers} *(Thu nhập tham khảo: ${m.salary})*\n` +
      `• **Định hướng & Tố chất phù hợp:** ${m.notes}`;
  }

  let out = `Chào bạn! Dựa trên cơ sở dữ liệu **20 ngành đào tạo đại học tại Việt Nam**, **UniBot** gợi ý và phân tích các ngành phù hợp nhất với yêu cầu của bạn:\n\n`;
  list.forEach((m, idx) => {
    out += `**${idx + 1}. ${m.name}** *(Mã ngành: \`${m.code}\`)*\n` +
      `• **Tổ hợp & Điểm chuẩn:** ${m.blocks} (${m.score} điểm)\n` +
      `• **Học phần trọng tâm:** ${m.subjects}\n` +
      `• **Trường đào tạo tiêu biểu:** ${m.universities}\n` +
      `• **Cơ hội nghề nghiệp & Thu nhập:** ${m.careers} — *${m.salary}*\n\n`;
  });
  out += `Bạn có thể nhấn nút **Chi tiết** ở bảng bên trái hoặc hỏi sâu hơn về từng ngành để **UniBot** giải đáp cụ thể hơn nhé!`;
  return out.trim();
}

async function handleChatSubmit(e) {
  if (e && e.preventDefault) e.preventDefault();
  const input = document.getElementById("chatInput");
  const question = input.value.trim();
  if (!question) return;

  input.value = "";
  appendChatBubble(question, true);
  const pendingBubble = appendChatBubble("Đang đối chiếu dữ liệu 20 ngành đào tạo và phân tích học thuật...", false);

  // Thứ tự ưu tiên API Key: 1. Key nhập trên UI (savedApiKey) -> 2. Key dự phòng trong code (FALLBACK_GEMINI_API_KEY)
  const keysToTry = Array.from(
    new Set([sanitizeApiKey(savedApiKey), sanitizeApiKey(FALLBACK_GEMINI_API_KEY)].filter(Boolean))
  );

  for (const keyCandidate of keysToTry) {
    try {
      const answer = await callGeminiDirect(question, keyCandidate);
      pendingBubble.innerHTML = formatMarkdown(answer);
      return;
    } catch (err) {
      console.warn("Thử kết nối Gemini API không thành công, chuyển sang phương án dự phòng:", err.message);
    }
  }

  // Thử gọi qua Backend Python (nếu đang chạy backend.py có biến môi trường / key dự phòng)
  try {
    const res = await fetch("http://127.0.0.1:8000/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, api_key: getEffectiveApiKey() })
    });
    if (res.ok) {
      const data = await res.json();
      pendingBubble.innerHTML = formatMarkdown(data.answer);
      return;
    }
  } catch (_) {}

  // Dự phòng cuối cùng: Bộ phân tích học thuật nội bộ thông minh (hoạt động ngay cả khi không nhập API Key)
  pendingBubble.innerHTML = formatMarkdown(localAcademicFallback(question));
}

// ============================================================================
// 5. QUẢN LÝ & KIỂM TRA TRỰC TIẾP GEMINI API KEY
// ============================================================================
function showModalFeedback(message, type = "info") {
  const box = document.getElementById("apiModalFeedback");
  if (!box) return;
  box.style.display = "block";
  if (type === "success") {
    box.style.backgroundColor = "#EAF6ED";
    box.style.color = "#166534";
    box.style.borderColor = "#BBE3C6";
  } else if (type === "error") {
    box.style.backgroundColor = "#FDECEC";
    box.style.color = "#991B1B";
    box.style.borderColor = "#F5C2C2";
  } else {
    box.style.backgroundColor = "#EBF3FA";
    box.style.color = "#0F4C81";
    box.style.borderColor = "#B8D4EC";
  }
  box.innerHTML = message;
}

function openApiModal() {
  const field = document.getElementById("apiKeyField");
  field.value = savedApiKey;
  const box = document.getElementById("apiModalFeedback");
  if (box) box.style.display = "none";
  document.getElementById("apiModal").classList.add("open");
  setTimeout(() => field.focus(), 50);
}

function closeApiModal() {
  document.getElementById("apiModal").classList.remove("open");
}

function clearSavedApiKey() {
  localStorage.removeItem("UNIGUIDE_GEMINI_API_KEY");
  savedApiKey = sanitizeApiKey(FALLBACK_GEMINI_API_KEY);
  document.getElementById("apiKeyField").value = "";
  updateApiStatusBadge();
  showModalFeedback(
    savedApiKey
      ? "Đã xóa Key trên trình duyệt và chuyển về sử dụng API Key dự phòng trong code."
      : "Đã xóa Key trên trình duyệt. Hệ thống tự động dùng chế độ AI dự phòng tích hợp sẵn.",
    "info"
  );
}

async function saveApiKeyConfig(e) {
  if (e && e.preventDefault) e.preventDefault();
  const rawInput = document.getElementById("apiKeyField").value;
  const cleanKey = sanitizeApiKey(rawInput);
  const saveBtn = document.getElementById("saveApiBtn");

  if (!cleanKey) {
    showModalFeedback("Vui lòng dán mã GEMINI_API_KEY (bắt đầu bằng AIza...) vào ô bên trên.", "error");
    return;
  }

  saveBtn.disabled = true;
  saveBtn.textContent = "Đang kiểm tra kết nối...";
  showModalFeedback("Đang xác thực API Key với máy chủ Google Gemini...", "info");

  try {
    const model = await resolveAvailableGeminiModel(cleanKey);
    savedApiKey = cleanKey;
    activeModelName = model;
    localStorage.setItem("UNIGUIDE_GEMINI_API_KEY", cleanKey);
    localStorage.setItem("UNIGUIDE_GEMINI_MODEL", model);
    updateApiStatusBadge();

    showModalFeedback(`✔ Kết nối thành công! Đã kích hoạt mô hình <strong>${model}</strong>.`, "success");
    appendChatBubble(`**Hệ thống:** Đã kết nối thành công với Google Gemini (\`${model}\`). Bạn có thể đặt bất kỳ câu hỏi tư vấn ngành học nào ngay bây giờ!`, false);

    setTimeout(() => {
      closeApiModal();
    }, 900);
  } catch (err) {
    showModalFeedback(`❌ Không thể kết nối với API Key này: <strong>${err.message}</strong>. Vui lòng kiểm tra lại mã khóa từ Google AI Studio.`, "error");
  } finally {
    saveBtn.disabled = false;
    saveBtn.textContent = "Kiểm tra & Lưu kết nối";
  }
}

function updateApiStatusBadge() {
  const dot = document.getElementById("apiStatusDot");
  const text = document.getElementById("apiStatusText");
  const sub = document.getElementById("advisorSubStatus");
  const effectiveKey = getEffectiveApiKey();
  if (effectiveKey) {
    dot.className = "status-dot";
    text.textContent = `Đã kết nối: ${activeModelName}`;
    if (sub) sub.textContent = `Đang chạy: ${activeModelName} • 20 Ngành ĐH`;
  } else {
    dot.className = "status-dot";
    text.textContent = "Sẵn sàng (Chế độ Dự phòng)";
    if (sub) sub.textContent = "Context Injection • 20 Ngành ĐH Việt Nam";
  }
}

// Khởi tạo giao diện
document.addEventListener("DOMContentLoaded", () => {
  updateApiStatusBadge();
  renderCatalog();
});
