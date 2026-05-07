// 云函数：自动初始化词汇库
const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

// 内置词汇数据
const VOCAB_DATA = [
  {
    "korean": "직장",
    "chinese": "职场",
    "pronunciation": "jik-jang",
    "type": "名词",
    "origin": "hanja",
    "etymology": "職場",
    "sourceLanguage": "chinese",
    "level": "intermediate",
    "topikLevel": "3-4",
    "category": "工作",
    "imageUrl": "https://source.unsplash.com/400x400/?职场",
    "audioUrl": "",
    "examples": [
      {
        "korean": "직장 생활이 힘들어요.",
        "chinese": "职场生活很辛苦。"
      },
      {
        "korean": "좋은 직장을 찾고 있어요.",
        "chinese": "正在找好的工作。"
      }
    ]
  },
  {
    "korean": "동료",
    "chinese": "同事",
    "pronunciation": "dong-ryo",
    "type": "名词",
    "origin": "hanja",
    "etymology": "同僚",
    "sourceLanguage": "chinese",
    "level": "intermediate",
    "topikLevel": "3-4",
    "category": "工作",
    "imageUrl": "https://source.unsplash.com/400x400/?同事",
    "audioUrl": "",
    "examples": [
      {
        "korean": "동료와 협력해서 일해요.",
        "chinese": "和同事合作工作。"
      }
    ]
  },
  {
    "korean": "상사",
    "chinese": "上司",
    "pronunciation": "sang-sa",
    "type": "名词",
    "origin": "hanja",
    "etymology": "上司",
    "sourceLanguage": "chinese",
    "level": "intermediate",
    "topikLevel": "3-4",
    "category": "工作",
    "imageUrl": "https://source.unsplash.com/400x400/?上司",
    "audioUrl": "",
    "examples": [
      {
        "korean": "상사에게 보고서를 제출했어요.",
        "chinese": "向上司提交了报告。"
      }
    ]
  },
  {
    "korean": "월급",
    "chinese": "工资",
    "pronunciation": "wol-geup",
    "type": "名词",
    "origin": "hanja",
    "etymology": "月給",
    "sourceLanguage": "chinese",
    "level": "intermediate",
    "topikLevel": "3-4",
    "category": "工作",
    "imageUrl": "https://source.unsplash.com/400x400/?工资",
    "audioUrl": "",
    "examples": [
      {
        "korean": "월급을 받았어요.",
        "chinese": "领工资了。"
      }
    ]
  },
  {
    "korean": "승진",
    "chinese": "升职",
    "pronunciation": "seung-jin",
    "type": "名词",
    "origin": "hanja",
    "etymology": "昇進",
    "sourceLanguage": "chinese",
    "level": "intermediate",
    "topikLevel": "3-4",
    "category": "工作",
    "imageUrl": "https://source.unsplash.com/400x400/?升职",
    "audioUrl": "",
    "examples": [
      {
        "korean": "열심히 일해서 승진했어요.",
        "chinese": "努力工作后升职了。"
      }
    ]
  },
  {
    "korean": "회의",
    "chinese": "会议",
    "pronunciation": "hoe-ui",
    "type": "名词",
    "origin": "hanja",
    "etymology": "會議",
    "sourceLanguage": "chinese",
    "level": "intermediate",
    "topikLevel": "3-4",
    "category": "工作",
    "imageUrl": "https://source.unsplash.com/400x400/?会议",
    "audioUrl": "",
    "examples": [
      {
        "korean": "오후에 중요한 회의가 있어요.",
        "chinese": "下午有重要会议。"
      }
    ]
  },
  {
    "korean": "계약",
    "chinese": "合同",
    "pronunciation": "gye-yak",
    "type": "名词",
    "origin": "hanja",
    "etymology": "契約",
    "sourceLanguage": "chinese",
    "level": "intermediate",
    "topikLevel": "3-4",
    "category": "工作",
    "imageUrl": "https://source.unsplash.com/400x400/?合同",
    "audioUrl": "",
    "examples": [
      {
        "korean": "계약서에 서명했어요.",
        "chinese": "在合同上签字了。"
      }
    ]
  },
  {
    "korean": "출장",
    "chinese": "出差",
    "pronunciation": "chul-jang",
    "type": "名词",
    "origin": "hanja",
    "etymology": "出張",
    "sourceLanguage": "chinese",
    "level": "intermediate",
    "topikLevel": "3-4",
    "category": "工作",
    "imageUrl": "https://source.unsplash.com/400x400/?出差",
    "audioUrl": "",
    "examples": [
      {
        "korean": "다음 주에 출장을 가요.",
        "chinese": "下周要出差。"
      }
    ]
  },
  {
    "korean": "휴가",
    "chinese": "休假",
    "pronunciation": "hyu-ga",
    "type": "名词",
    "origin": "hanja",
    "etymology": "休暇",
    "sourceLanguage": "chinese",
    "level": "intermediate",
    "topikLevel": "3-4",
    "category": "工作",
    "imageUrl": "https://source.unsplash.com/400x400/?休假",
    "audioUrl": "",
    "examples": [
      {
        "korean": "여름 휴가를 신청했어요.",
        "chinese": "申请了暑假。"
      }
    ]
  },
  {
    "korean": "연봉",
    "chinese": "年薪",
    "pronunciation": "yeon-bong",
    "type": "名词",
    "origin": "hanja",
    "etymology": "年俸",
    "sourceLanguage": "chinese",
    "level": "intermediate",
    "topikLevel": "3-4",
    "category": "工作",
    "imageUrl": "https://source.unsplash.com/400x400/?年薪",
    "audioUrl": "",
    "examples": [
      {
        "korean": "연봉 협상을 했어요.",
        "chinese": "进行了年薪协商。"
      }
    ]
  },
  {
    "korean": "인터넷",
    "chinese": "互联网",
    "pronunciation": "in-teo-net",
    "type": "名词",
    "origin": "loanword",
    "etymology": "internet",
    "sourceLanguage": "english",
    "level": "intermediate",
    "topikLevel": "3-4",
    "category": "科技",
    "imageUrl": "https://source.unsplash.com/400x400/?互联网",
    "audioUrl": "",
    "examples": [
      {
        "korean": "인터넷으로 정보를 찾아요.",
        "chinese": "用互联网查找信息。"
      }
    ]
  },
  {
    "korean": "이메일",
    "chinese": "电子邮件",
    "pronunciation": "i-me-il",
    "type": "名词",
    "origin": "loanword",
    "etymology": "email",
    "sourceLanguage": "english",
    "level": "intermediate",
    "topikLevel": "3-4",
    "category": "科技",
    "imageUrl": "https://source.unsplash.com/400x400/?电子邮件",
    "audioUrl": "",
    "examples": [
      {
        "korean": "이메일을 확인했어요.",
        "chinese": "确认了邮件。"
      }
    ]
  },
  {
    "korean": "프로그램",
    "chinese": "程序",
    "pronunciation": "peu-ro-geu-raem",
    "type": "名词",
    "origin": "loanword",
    "etymology": "program",
    "sourceLanguage": "english",
    "level": "intermediate",
    "topikLevel": "3-4",
    "category": "科技",
    "imageUrl": "https://source.unsplash.com/400x400/?程序",
    "audioUrl": "",
    "examples": [
      {
        "korean": "새로운 프로그램을 설치했어요.",
        "chinese": "安装了新程序。"
      }
    ]
  },
  {
    "korean": "소프트웨어",
    "chinese": "软件",
    "pronunciation": "so-peu-teu-we-eo",
    "type": "名词",
    "origin": "loanword",
    "etymology": "software",
    "sourceLanguage": "english",
    "level": "intermediate",
    "topikLevel": "3-4",
    "category": "科技",
    "imageUrl": "https://source.unsplash.com/400x400/?软件",
    "audioUrl": "",
    "examples": [
      {
        "korean": "소프트웨어를 업데이트해야 해요.",
        "chinese": "需要更新软件。"
      }
    ]
  },
  {
    "korean": "하드웨어",
    "chinese": "硬件",
    "pronunciation": "ha-deu-we-eo",
    "type": "名词",
    "origin": "loanword",
    "etymology": "hardware",
    "sourceLanguage": "english",
    "level": "intermediate",
    "topikLevel": "3-4",
    "category": "科技",
    "imageUrl": "https://source.unsplash.com/400x400/?硬件",
    "audioUrl": "",
    "examples": [
      {
        "korean": "하드웨어 문제가 있어요.",
        "chinese": "有硬件问题。"
      }
    ]
  },
  {
    "korean": "다운로드",
    "chinese": "下载",
    "pronunciation": "da-un-ro-deu",
    "type": "动词",
    "origin": "loanword",
    "etymology": "download",
    "sourceLanguage": "english",
    "level": "intermediate",
    "topikLevel": "3-4",
    "category": "科技",
    "imageUrl": "https://source.unsplash.com/400x400/?下载",
    "audioUrl": "",
    "examples": [
      {
        "korean": "파일을 다운로드했어요.",
        "chinese": "下载了文件。"
      }
    ]
  },
  {
    "korean": "업로드",
    "chinese": "上传",
    "pronunciation": "eop-ro-deu",
    "type": "动词",
    "origin": "loanword",
    "etymology": "upload",
    "sourceLanguage": "english",
    "level": "intermediate",
    "topikLevel": "3-4",
    "category": "科技",
    "imageUrl": "https://source.unsplash.com/400x400/?上传",
    "audioUrl": "",
    "examples": [
      {
        "korean": "사진을 업로드했어요.",
        "chinese": "上传了照片。"
      }
    ]
  },
  {
    "korean": "비밀번호",
    "chinese": "密码",
    "pronunciation": "bi-mil-beon-ho",
    "type": "名词",
    "origin": "hanja",
    "etymology": "秘密番號",
    "sourceLanguage": "chinese",
    "level": "intermediate",
    "topikLevel": "3-4",
    "category": "科技",
    "imageUrl": "https://source.unsplash.com/400x400/?密码",
    "audioUrl": "",
    "examples": [
      {
        "korean": "비밀번호를 변경하세요.",
        "chinese": "请更改密码。"
      }
    ]
  },
  {
    "korean": "네트워크",
    "chinese": "网络",
    "pronunciation": "ne-teu-wo-keu",
    "type": "名词",
    "origin": "loanword",
    "etymology": "network",
    "sourceLanguage": "english",
    "level": "intermediate",
    "topikLevel": "3-4",
    "category": "科技",
    "imageUrl": "https://source.unsplash.com/400x400/?网络",
    "audioUrl": "",
    "examples": [
      {
        "korean": "네트워크 연결이 끊겼어요.",
        "chinese": "网络连接断开了。"
      }
    ]
  },
  {
    "korean": "데이터",
    "chinese": "数据",
    "pronunciation": "de-i-teo",
    "type": "名词",
    "origin": "loanword",
    "etymology": "data",
    "sourceLanguage": "english",
    "level": "intermediate",
    "topikLevel": "3-4",
    "category": "科技",
    "imageUrl": "https://source.unsplash.com/400x400/?数据",
    "audioUrl": "",
    "examples": [
      {
        "korean": "데이터를 백업했어요.",
        "chinese": "备份了数据。"
      }
    ]
  },
  {
    "korean": "사회",
    "chinese": "社会",
    "pronunciation": "sa-hoe",
    "type": "名词",
    "origin": "hanja",
    "etymology": "社會",
    "sourceLanguage": "chinese",
    "level": "intermediate",
    "topikLevel": "3-4",
    "category": "社会",
    "imageUrl": "https://source.unsplash.com/400x400/?社会",
    "audioUrl": "",
    "examples": [
      {
        "korean": "현대 사회는 복잡해요.",
        "chinese": "现代社会很复杂。"
      }
    ]
  },
  {
    "korean": "문화",
    "chinese": "文化",
    "pronunciation": "mun-hwa",
    "type": "名词",
    "origin": "hanja",
    "etymology": "文化",
    "sourceLanguage": "chinese",
    "level": "intermediate",
    "topikLevel": "3-4",
    "category": "社会",
    "imageUrl": "https://source.unsplash.com/400x400/?文化",
    "audioUrl": "",
    "examples": [
      {
        "korean": "한국 문화를 배우고 있어요.",
        "chinese": "正在学习韩国文化。"
      }
    ]
  },
  {
    "korean": "전통",
    "chinese": "传统",
    "pronunciation": "jeon-tong",
    "type": "名词",
    "origin": "hanja",
    "etymology": "傳統",
    "sourceLanguage": "chinese",
    "level": "intermediate",
    "topikLevel": "3-4",
    "category": "社会",
    "imageUrl": "https://source.unsplash.com/400x400/?传统",
    "audioUrl": "",
    "examples": [
      {
        "korean": "전통 문화를 보존해야 해요.",
        "chinese": "应该保护传统文化。"
      }
    ]
  },
  {
    "korean": "역사",
    "chinese": "历史",
    "pronunciation": "yeok-sa",
    "type": "名词",
    "origin": "hanja",
    "etymology": "歷史",
    "sourceLanguage": "chinese",
    "level": "intermediate",
    "topikLevel": "3-4",
    "category": "社会",
    "imageUrl": "https://source.unsplash.com/400x400/?历史",
    "audioUrl": "",
    "examples": [
      {
        "korean": "한국 역사를 공부해요.",
        "chinese": "学习韩国历史。"
      }
    ]
  },
  {
    "korean": "환경",
    "chinese": "环境",
    "pronunciation": "hwan-gyeong",
    "type": "名词",
    "origin": "hanja",
    "etymology": "環境",
    "sourceLanguage": "chinese",
    "level": "intermediate",
    "topikLevel": "3-4",
    "category": "社会",
    "imageUrl": "https://source.unsplash.com/400x400/?环境",
    "audioUrl": "",
    "examples": [
      {
        "korean": "환경 보호가 중요해요.",
        "chinese": "环保很重要。"
      }
    ]
  },
  {
    "korean": "오염",
    "chinese": "污染",
    "pronunciation": "o-yeom",
    "type": "名词",
    "origin": "hanja",
    "etymology": "汚染",
    "sourceLanguage": "chinese",
    "level": "intermediate",
    "topikLevel": "3-4",
    "category": "社会",
    "imageUrl": "https://source.unsplash.com/400x400/?污染",
    "audioUrl": "",
    "examples": [
      {
        "korean": "공기 오염이 심각해요.",
        "chinese": "空气污染很严重。"
      }
    ]
  },
  {
    "korean": "인구",
    "chinese": "人口",
    "pronunciation": "in-gu",
    "type": "名词",
    "origin": "hanja",
    "etymology": "人口",
    "sourceLanguage": "chinese",
    "level": "intermediate",
    "topikLevel": "3-4",
    "category": "社会",
    "imageUrl": "https://source.unsplash.com/400x400/?人口",
    "audioUrl": "",
    "examples": [
      {
        "korean": "한국의 인구가 감소하고 있어요.",
        "chinese": "韩国人口在减少。"
      }
    ]
  },
  {
    "korean": "세대",
    "chinese": "世代",
    "pronunciation": "se-dae",
    "type": "名词",
    "origin": "hanja",
    "etymology": "世代",
    "sourceLanguage": "chinese",
    "level": "intermediate",
    "topikLevel": "3-4",
    "category": "社会",
    "imageUrl": "https://source.unsplash.com/400x400/?世代",
    "audioUrl": "",
    "examples": [
      {
        "korean": "세대 간의 차이가 있어요.",
        "chinese": "代际之间有差异。"
      }
    ]
  },
  {
    "korean": "경제",
    "chinese": "经济",
    "pronunciation": "gyeong-je",
    "type": "名词",
    "origin": "hanja",
    "etymology": "經濟",
    "sourceLanguage": "chinese",
    "level": "intermediate",
    "topikLevel": "3-4",
    "category": "社会",
    "imageUrl": "https://source.unsplash.com/400x400/?经济",
    "audioUrl": "",
    "examples": [
      {
        "korean": "경제가 발전하고 있어요.",
        "chinese": "经济正在发展。"
      }
    ]
  },
  {
    "korean": "정치",
    "chinese": "政治",
    "pronunciation": "jeong-chi",
    "type": "名词",
    "origin": "hanja",
    "etymology": "政治",
    "sourceLanguage": "chinese",
    "level": "intermediate",
    "topikLevel": "3-4",
    "category": "社会",
    "imageUrl": "https://source.unsplash.com/400x400/?政治",
    "audioUrl": "",
    "examples": [
      {
        "korean": "정치에 관심이 많아요.",
        "chinese": "对政治很感兴趣。"
      }
    ]
  },
  {
    "korean": "법률",
    "chinese": "法律",
    "pronunciation": "beop-ryul",
    "type": "名词",
    "origin": "hanja",
    "etymology": "法律",
    "sourceLanguage": "chinese",
    "level": "intermediate",
    "topikLevel": "3-4",
    "category": "社会",
    "imageUrl": "https://source.unsplash.com/400x400/?法律",
    "audioUrl": "",
    "examples": [
      {
        "korean": "법률을 준수해야 해요.",
        "chinese": "应该遵守法律。"
      }
    ]
  },
  {
    "korean": "권리",
    "chinese": "权利",
    "pronunciation": "gwon-ri",
    "type": "名词",
    "origin": "hanja",
    "etymology": "權利",
    "sourceLanguage": "chinese",
    "level": "intermediate",
    "topikLevel": "3-4",
    "category": "社会",
    "imageUrl": "https://source.unsplash.com/400x400/?权利",
    "audioUrl": "",
    "examples": [
      {
        "korean": "모든 사람은 평등한 권리가 있어요.",
        "chinese": "所有人都有平等权利。"
      }
    ]
  },
  {
    "korean": "의무",
    "chinese": "义务",
    "pronunciation": "ui-mu",
    "type": "名词",
    "origin": "hanja",
    "etymology": "義務",
    "sourceLanguage": "chinese",
    "level": "intermediate",
    "topikLevel": "3-4",
    "category": "社会",
    "imageUrl": "https://source.unsplash.com/400x400/?义务",
    "audioUrl": "",
    "examples": [
      {
        "korean": "국민의 의무를 다해야 해요.",
        "chinese": "应该履行国民义务。"
      }
    ]
  },
  {
    "korean": "복지",
    "chinese": "福利",
    "pronunciation": "bok-ji",
    "type": "名词",
    "origin": "hanja",
    "etymology": "福祉",
    "sourceLanguage": "chinese",
    "level": "intermediate",
    "topikLevel": "3-4",
    "category": "社会",
    "imageUrl": "https://source.unsplash.com/400x400/?福利",
    "audioUrl": "",
    "examples": [
      {
        "korean": "사회 복지 제도가 중요해요.",
        "chinese": "社会福利制度很重要。"
      }
    ]
  },
  {
    "korean": "교육",
    "chinese": "教育",
    "pronunciation": "gyo-yuk",
    "type": "名词",
    "origin": "hanja",
    "etymology": "教育",
    "sourceLanguage": "chinese",
    "level": "intermediate",
    "topikLevel": "3-4",
    "category": "教育",
    "imageUrl": "https://source.unsplash.com/400x400/?教育",
    "audioUrl": "",
    "examples": [
      {
        "korean": "교육의 질이 중요해요.",
        "chinese": "教育质量很重要。"
      }
    ]
  },
  {
    "korean": "시험",
    "chinese": "考试",
    "pronunciation": "si-heom",
    "type": "名词",
    "origin": "hanja",
    "etymology": "試驗",
    "sourceLanguage": "chinese",
    "level": "intermediate",
    "topikLevel": "3-4",
    "category": "教育",
    "imageUrl": "https://source.unsplash.com/400x400/?考试",
    "audioUrl": "",
    "examples": [
      {
        "korean": "다음 주에 시험이 있어요.",
        "chinese": "下周有考试。"
      }
    ]
  },
  {
    "korean": "성적",
    "chinese": "成绩",
    "pronunciation": "seong-jeok",
    "type": "名词",
    "origin": "hanja",
    "etymology": "成績",
    "sourceLanguage": "chinese",
    "level": "intermediate",
    "topikLevel": "3-4",
    "category": "教育",
    "imageUrl": "https://source.unsplash.com/400x400/?成绩",
    "audioUrl": "",
    "examples": [
      {
        "korean": "성적이 좋아졌어요.",
        "chinese": "成绩变好了。"
      }
    ]
  },
  {
    "korean": "졸업",
    "chinese": "毕业",
    "pronunciation": "jol-eop",
    "type": "名词",
    "origin": "hanja",
    "etymology": "卒業",
    "sourceLanguage": "chinese",
    "level": "intermediate",
    "topikLevel": "3-4",
    "category": "教育",
    "imageUrl": "https://source.unsplash.com/400x400/?毕业",
    "audioUrl": "",
    "examples": [
      {
        "korean": "대학교를 졸업했어요.",
        "chinese": "大学毕业了。"
      }
    ]
  },
  {
    "korean": "입학",
    "chinese": "入学",
    "pronunciation": "ip-hak",
    "type": "名词",
    "origin": "hanja",
    "etymology": "入學",
    "sourceLanguage": "chinese",
    "level": "intermediate",
    "topikLevel": "3-4",
    "category": "教育",
    "imageUrl": "https://source.unsplash.com/400x400/?入学",
    "audioUrl": "",
    "examples": [
      {
        "korean": "대학에 입학했어요.",
        "chinese": "考上大学了。"
      }
    ]
  },
  {
    "korean": "장학금",
    "chinese": "奖学金",
    "pronunciation": "jang-hak-geum",
    "type": "名词",
    "origin": "hanja",
    "etymology": "奬學金",
    "sourceLanguage": "chinese",
    "level": "intermediate",
    "topikLevel": "3-4",
    "category": "教育",
    "imageUrl": "https://source.unsplash.com/400x400/?奖学金",
    "audioUrl": "",
    "examples": [
      {
        "korean": "장학금을 받았어요.",
        "chinese": "获得了奖学金。"
      }
    ]
  },
  {
    "korean": "전공",
    "chinese": "专业",
    "pronunciation": "jeon-gong",
    "type": "名词",
    "origin": "hanja",
    "etymology": "專攻",
    "sourceLanguage": "chinese",
    "level": "intermediate",
    "topikLevel": "3-4",
    "category": "教育",
    "imageUrl": "https://source.unsplash.com/400x400/?专业",
    "audioUrl": "",
    "examples": [
      {
        "korean": "경제학을 전공해요.",
        "chinese": "主修经济学。"
      }
    ]
  },
  {
    "korean": "학위",
    "chinese": "学位",
    "pronunciation": "hang-wi",
    "type": "名词",
    "origin": "hanja",
    "etymology": "學位",
    "sourceLanguage": "chinese",
    "level": "intermediate",
    "topikLevel": "3-4",
    "category": "教育",
    "imageUrl": "https://source.unsplash.com/400x400/?学位",
    "audioUrl": "",
    "examples": [
      {
        "korean": "석사 학위를 취득했어요.",
        "chinese": "获得了硕士学位。"
      }
    ]
  },
  {
    "korean": "연구",
    "chinese": "研究",
    "pronunciation": "yeon-gu",
    "type": "名词",
    "origin": "hanja",
    "etymology": "研究",
    "sourceLanguage": "chinese",
    "level": "intermediate",
    "topikLevel": "3-4",
    "category": "教育",
    "imageUrl": "https://source.unsplash.com/400x400/?研究",
    "audioUrl": "",
    "examples": [
      {
        "korean": "새로운 주제를 연구하고 있어요.",
        "chinese": "正在研究新课题。"
      }
    ]
  },
  {
    "korean": "논문",
    "chinese": "论文",
    "pronunciation": "non-mun",
    "type": "名词",
    "origin": "hanja",
    "etymology": "論文",
    "sourceLanguage": "chinese",
    "level": "intermediate",
    "topikLevel": "3-4",
    "category": "教育",
    "imageUrl": "https://source.unsplash.com/400x400/?论文",
    "audioUrl": "",
    "examples": [
      {
        "korean": "논문을 쓰고 있어요.",
        "chinese": "正在写论文。"
      }
    ]
  },
  {
    "korean": "기분",
    "chinese": "心情",
    "pronunciation": "gi-bun",
    "type": "名词",
    "origin": "hanja",
    "etymology": "氣分",
    "sourceLanguage": "chinese",
    "level": "intermediate",
    "topikLevel": "3-4",
    "category": "情感",
    "imageUrl": "https://source.unsplash.com/400x400/?心情",
    "audioUrl": "",
    "examples": [
      {
        "korean": "기분이 좋아요.",
        "chinese": "心情很好。"
      },
      {
        "korean": "오늘 기분이 어때요?",
        "chinese": "今天心情怎么样？"
      }
    ]
  },
  {
    "korean": "행복",
    "chinese": "幸福",
    "pronunciation": "haeng-bok",
    "type": "名词",
    "origin": "hanja",
    "etymology": "幸福",
    "sourceLanguage": "chinese",
    "level": "intermediate",
    "topikLevel": "3-4",
    "category": "情感",
    "imageUrl": "https://source.unsplash.com/400x400/?幸福",
    "audioUrl": "",
    "examples": [
      {
        "korean": "가족과 함께 있을 때 행복해요.",
        "chinese": "和家人在一起时很幸福。"
      }
    ]
  },
  {
    "korean": "슬프다",
    "chinese": "悲伤",
    "pronunciation": "seul-peu-da",
    "type": "形容词",
    "origin": "native",
    "etymology": "",
    "sourceLanguage": "",
    "level": "intermediate",
    "topikLevel": "3-4",
    "category": "情感",
    "imageUrl": "https://source.unsplash.com/400x400/?悲伤",
    "audioUrl": "",
    "examples": [
      {
        "korean": "영화가 슬퍼서 울었어요.",
        "chinese": "电影很悲伤所以哭了。"
      }
    ]
  },
  {
    "korean": "기쁘다",
    "chinese": "高兴",
    "pronunciation": "gi-ppeu-da",
    "type": "形容词",
    "origin": "native",
    "etymology": "",
    "sourceLanguage": "",
    "level": "intermediate",
    "topikLevel": "3-4",
    "category": "情感",
    "imageUrl": "https://source.unsplash.com/400x400/?高兴",
    "audioUrl": "",
    "examples": [
      {
        "korean": "친구를 만나서 기뻐요.",
        "chinese": "见到朋友很高兴。"
      }
    ]
  },
  {
    "korean": "화나다",
    "chinese": "生气",
    "pronunciation": "hwa-na-da",
    "type": "动词",
    "origin": "hanja",
    "etymology": "火",
    "sourceLanguage": "chinese",
    "level": "intermediate",
    "topikLevel": "3-4",
    "category": "情感",
    "imageUrl": "https://source.unsplash.com/400x400/?生气",
    "audioUrl": "",
    "examples": [
      {
        "korean": "거짓말을 들어서 화났어요.",
        "chinese": "听到谎言后生气了。"
      }
    ]
  },
  {
    "korean": "걱정",
    "chinese": "担心",
    "pronunciation": "geok-jeong",
    "type": "名词",
    "origin": "native",
    "etymology": "",
    "sourceLanguage": "",
    "level": "intermediate",
    "topikLevel": "3-4",
    "category": "情感",
    "imageUrl": "https://source.unsplash.com/400x400/?担心",
    "audioUrl": "",
    "examples": [
      {
        "korean": "걱정하지 마세요.",
        "chinese": "不要担心。"
      }
    ]
  },
  {
    "korean": "후회",
    "chinese": "后悔",
    "pronunciation": "hu-hoe",
    "type": "名词",
    "origin": "hanja",
    "etymology": "後悔",
    "sourceLanguage": "chinese",
    "level": "intermediate",
    "topikLevel": "3-4",
    "category": "情感",
    "imageUrl": "https://source.unsplash.com/400x400/?后悔",
    "audioUrl": "",
    "examples": [
      {
        "korean": "후회하지 않을 거예요.",
        "chinese": "不会后悔的。"
      }
    ]
  },
  {
    "korean": "외롭다",
    "chinese": "孤独",
    "pronunciation": "oe-rop-da",
    "type": "形容词",
    "origin": "native",
    "etymology": "",
    "sourceLanguage": "",
    "level": "intermediate",
    "topikLevel": "3-4",
    "category": "情感",
    "imageUrl": "https://source.unsplash.com/400x400/?孤独",
    "audioUrl": "",
    "examples": [
      {
        "korean": "혼자 있으니까 외로워요.",
        "chinese": "一个人很孤独。"
      }
    ]
  },
  {
    "korean": "스트레스",
    "chinese": "压力",
    "pronunciation": "seu-teu-re-seu",
    "type": "名词",
    "origin": "loanword",
    "etymology": "stress",
    "sourceLanguage": "english",
    "level": "intermediate",
    "topikLevel": "3-4",
    "category": "情感",
    "imageUrl": "https://source.unsplash.com/400x400/?压力",
    "audioUrl": "",
    "examples": [
      {
        "korean": "스트레스가 많아요.",
        "chinese": "压力很大。"
      }
    ]
  },
  {
    "korean": "감동",
    "chinese": "感动",
    "pronunciation": "gam-dong",
    "type": "名词",
    "origin": "hanja",
    "etymology": "感動",
    "sourceLanguage": "chinese",
    "level": "intermediate",
    "topikLevel": "3-4",
    "category": "情感",
    "imageUrl": "https://source.unsplash.com/400x400/?感动",
    "audioUrl": "",
    "examples": [
      {
        "korean": "그 이야기에 감동했어요.",
        "chinese": "被那个故事感动了。"
      }
    ]
  },
  {
    "korean": "이론",
    "chinese": "理论",
    "pronunciation": "i-ron",
    "type": "名词",
    "origin": "hanja",
    "etymology": "理論",
    "sourceLanguage": "chinese",
    "level": "advanced",
    "topikLevel": "5-6",
    "category": "学术",
    "imageUrl": "https://source.unsplash.com/400x400/?理论",
    "audioUrl": "",
    "examples": [
      {
        "korean": "새로운 이론을 제시했어요.",
        "chinese": "提出了新理论。"
      }
    ]
  },
  {
    "korean": "가설",
    "chinese": "假设",
    "pronunciation": "ga-seol",
    "type": "名词",
    "origin": "hanja",
    "etymology": "假說",
    "sourceLanguage": "chinese",
    "level": "advanced",
    "topikLevel": "5-6",
    "category": "学术",
    "imageUrl": "https://source.unsplash.com/400x400/?假设",
    "audioUrl": "",
    "examples": [
      {
        "korean": "가설을 검증하기 위해 실험을 했어요.",
        "chinese": "为了验证假设做了实验。"
      }
    ]
  },
  {
    "korean": "분석",
    "chinese": "分析",
    "pronunciation": "bun-seok",
    "type": "名词",
    "origin": "hanja",
    "etymology": "分析",
    "sourceLanguage": "chinese",
    "level": "advanced",
    "topikLevel": "5-6",
    "category": "学术",
    "imageUrl": "https://source.unsplash.com/400x400/?分析",
    "audioUrl": "",
    "examples": [
      {
        "korean": "데이터를 분석했어요.",
        "chinese": "分析了数据。"
      }
    ]
  },
  {
    "korean": "통계",
    "chinese": "统计",
    "pronunciation": "tong-gye",
    "type": "名词",
    "origin": "hanja",
    "etymology": "統計",
    "sourceLanguage": "chinese",
    "level": "advanced",
    "topikLevel": "5-6",
    "category": "学术",
    "imageUrl": "https://source.unsplash.com/400x400/?统计",
    "audioUrl": "",
    "examples": [
      {
        "korean": "통계 자료를 수집했어요.",
        "chinese": "收集了统计资料。"
      }
    ]
  },
  {
    "korean": "방법론",
    "chinese": "方法论",
    "pronunciation": "bang-beop-ron",
    "type": "名词",
    "origin": "hanja",
    "etymology": "方法論",
    "sourceLanguage": "chinese",
    "level": "advanced",
    "topikLevel": "5-6",
    "category": "学术",
    "imageUrl": "https://source.unsplash.com/400x400/?方法论",
    "audioUrl": "",
    "examples": [
      {
        "korean": "연구 방법론을 배웠어요.",
        "chinese": "学习了研究方法论。"
      }
    ]
  },
  {
    "korean": "개념",
    "chinese": "概念",
    "pronunciation": "gae-nyeom",
    "type": "名词",
    "origin": "hanja",
    "etymology": "概念",
    "sourceLanguage": "chinese",
    "level": "advanced",
    "topikLevel": "5-6",
    "category": "学术",
    "imageUrl": "https://source.unsplash.com/400x400/?概念",
    "audioUrl": "",
    "examples": [
      {
        "korean": "새로운 개념을 이해했어요.",
        "chinese": "理解了新概念。"
      }
    ]
  },
  {
    "korean": "원리",
    "chinese": "原理",
    "pronunciation": "won-ri",
    "type": "名词",
    "origin": "hanja",
    "etymology": "原理",
    "sourceLanguage": "chinese",
    "level": "advanced",
    "topikLevel": "5-6",
    "category": "学术",
    "imageUrl": "https://source.unsplash.com/400x400/?原理",
    "audioUrl": "",
    "examples": [
      {
        "korean": "그 현상의 원리를 설명했어요.",
        "chinese": "解释了那个现象的原理。"
      }
    ]
  },
  {
    "korean": "철학",
    "chinese": "哲学",
    "pronunciation": "cheol-hak",
    "type": "名词",
    "origin": "hanja",
    "etymology": "哲學",
    "sourceLanguage": "chinese",
    "level": "advanced",
    "topikLevel": "5-6",
    "category": "学术",
    "imageUrl": "https://source.unsplash.com/400x400/?哲学",
    "audioUrl": "",
    "examples": [
      {
        "korean": "동양 철학을 연구해요.",
        "chinese": "研究东方哲学。"
      }
    ]
  },
  {
    "korean": "심리학",
    "chinese": "心理学",
    "pronunciation": "sim-ri-hak",
    "type": "名词",
    "origin": "hanja",
    "etymology": "心理學",
    "sourceLanguage": "chinese",
    "level": "advanced",
    "topikLevel": "5-6",
    "category": "学术",
    "imageUrl": "https://source.unsplash.com/400x400/?心理学",
    "audioUrl": "",
    "examples": [
      {
        "korean": "심리학을 전공했어요.",
        "chinese": "主修了心理学。"
      }
    ]
  },
  {
    "korean": "사회학",
    "chinese": "社会学",
    "pronunciation": "sa-hoe-hak",
    "type": "名词",
    "origin": "hanja",
    "etymology": "社會學",
    "sourceLanguage": "chinese",
    "level": "advanced",
    "topikLevel": "5-6",
    "category": "学术",
    "imageUrl": "https://source.unsplash.com/400x400/?社会学",
    "audioUrl": "",
    "examples": [
      {
        "korean": "사회학적 관점에서 분석했어요.",
        "chinese": "从社会学角度进行了分析。"
      }
    ]
  },
  {
    "korean": "투자",
    "chinese": "投资",
    "pronunciation": "tu-ja",
    "type": "名词",
    "origin": "hanja",
    "etymology": "投資",
    "sourceLanguage": "chinese",
    "level": "advanced",
    "topikLevel": "5-6",
    "category": "商务",
    "imageUrl": "https://source.unsplash.com/400x400/?投资",
    "audioUrl": "",
    "examples": [
      {
        "korean": "부동산에 투자했어요.",
        "chinese": "投资了房地产。"
      }
    ]
  },
  {
    "korean": "수익",
    "chinese": "收益",
    "pronunciation": "su-ik",
    "type": "名词",
    "origin": "hanja",
    "etymology": "收益",
    "sourceLanguage": "chinese",
    "level": "advanced",
    "topikLevel": "5-6",
    "category": "商务",
    "imageUrl": "https://source.unsplash.com/400x400/?收益",
    "audioUrl": "",
    "examples": [
      {
        "korean": "수익이 증가했어요.",
        "chinese": "收益增加了。"
      }
    ]
  },
  {
    "korean": "손실",
    "chinese": "损失",
    "pronunciation": "son-sil",
    "type": "名词",
    "origin": "hanja",
    "etymology": "損失",
    "sourceLanguage": "chinese",
    "level": "advanced",
    "topikLevel": "5-6",
    "category": "商务",
    "imageUrl": "https://source.unsplash.com/400x400/?损失",
    "audioUrl": "",
    "examples": [
      {
        "korean": "큰 손실을 입었어요.",
        "chinese": "遭受了巨大损失。"
      }
    ]
  },
  {
    "korean": "전략",
    "chinese": "战略",
    "pronunciation": "jeon-ryak",
    "type": "名词",
    "origin": "hanja",
    "etymology": "戰略",
    "sourceLanguage": "chinese",
    "level": "advanced",
    "topikLevel": "5-6",
    "category": "商务",
    "imageUrl": "https://source.unsplash.com/400x400/?战略",
    "audioUrl": "",
    "examples": [
      {
        "korean": "새로운 전략을 수립했어요.",
        "chinese": "制定了新战略。"
      }
    ]
  },
  {
    "korean": "경영",
    "chinese": "经营",
    "pronunciation": "gyeong-yeong",
    "type": "名词",
    "origin": "hanja",
    "etymology": "經營",
    "sourceLanguage": "chinese",
    "level": "advanced",
    "topikLevel": "5-6",
    "category": "商务",
    "imageUrl": "https://source.unsplash.com/400x400/?经营",
    "audioUrl": "",
    "examples": [
      {
        "korean": "회사를 경영하고 있어요.",
        "chinese": "正在经营公司。"
      }
    ]
  },
  {
    "korean": "마케팅",
    "chinese": "营销",
    "pronunciation": "ma-ke-ting",
    "type": "名词",
    "origin": "loanword",
    "etymology": "marketing",
    "sourceLanguage": "english",
    "level": "advanced",
    "topikLevel": "5-6",
    "category": "商务",
    "imageUrl": "https://source.unsplash.com/400x400/?营销",
    "audioUrl": "",
    "examples": [
      {
        "korean": "마케팅 전략을 개발했어요.",
        "chinese": "开发了营销策略。"
      }
    ]
  },
  {
    "korean": "브랜드",
    "chinese": "品牌",
    "pronunciation": "beu-raen-deu",
    "type": "名词",
    "origin": "loanword",
    "etymology": "brand",
    "sourceLanguage": "english",
    "level": "advanced",
    "topikLevel": "5-6",
    "category": "商务",
    "imageUrl": "https://source.unsplash.com/400x400/?品牌",
    "audioUrl": "",
    "examples": [
      {
        "korean": "브랜드 가치가 높아요.",
        "chinese": "品牌价值很高。"
      }
    ]
  },
  {
    "korean": "경쟁",
    "chinese": "竞争",
    "pronunciation": "gyeong-jaeng",
    "type": "名词",
    "origin": "hanja",
    "etymology": "競爭",
    "sourceLanguage": "chinese",
    "level": "advanced",
    "topikLevel": "5-6",
    "category": "商务",
    "imageUrl": "https://source.unsplash.com/400x400/?竞争",
    "audioUrl": "",
    "examples": [
      {
        "korean": "시장 경쟁이 심해요.",
        "chinese": "市场竞争很激烈。"
      }
    ]
  },
  {
    "korean": "혁신",
    "chinese": "创新",
    "pronunciation": "hyeok-sin",
    "type": "名词",
    "origin": "hanja",
    "etymology": "革新",
    "sourceLanguage": "chinese",
    "level": "advanced",
    "topikLevel": "5-6",
    "category": "商务",
    "imageUrl": "https://source.unsplash.com/400x400/?创新",
    "audioUrl": "",
    "examples": [
      {
        "korean": "기술 혁신이 필요해요.",
        "chinese": "需要技术创新。"
      }
    ]
  },
  {
    "korean": "글로벌",
    "chinese": "全球化",
    "pronunciation": "geul-lo-beol",
    "type": "名词",
    "origin": "loanword",
    "etymology": "global",
    "sourceLanguage": "english",
    "level": "advanced",
    "topikLevel": "5-6",
    "category": "商务",
    "imageUrl": "https://source.unsplash.com/400x400/?全球化",
    "audioUrl": "",
    "examples": [
      {
        "korean": "글로벌 시장에 진출했어요.",
        "chinese": "进军了全球市场。"
      }
    ]
  }
];

exports.main = async (event, context) => {
  try {
    // 检查数据库是否已有数据
    const count = await db.collection('words').count();
    
    if (count.total > 0) {
      console.log('数据库已有数据:', count.total);
      return {
        success: true,
        message: `数据库已有 ${count.total} 个单词`,
        count: count.total,
        needInit: false
      };
    }
    
    // 数据库为空，开始导入
    console.log('数据库为空，开始初始化...');
    
    let imported = 0;
    const batchSize = 20; // 每批20个
    
    for (let i = 0; i < VOCAB_DATA.length; i += batchSize) {
      const batch = VOCAB_DATA.slice(i, i + batchSize);
      
      // 批量添加
      const promises = batch.map(word => 
        db.collection('words').add({ data: word })
      );
      
      await Promise.all(promises);
      imported += batch.length;
      
      console.log(`已导入 ${imported}/${VOCAB_DATA.length}`);
    }
    
    return {
      success: true,
      message: `✅ 初始化完成！共导入 ${imported} 个单词`,
      count: imported,
      needInit: false
    };
    
  } catch (err) {
    console.error('初始化失败:', err);
    return {
      success: false,
      error: err.message,
      needInit: true
    };
  }
};
