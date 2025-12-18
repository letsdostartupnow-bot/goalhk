
import { Provider, ServiceMode, TaskStep } from '../types';

export const SCENARIO_KEYWORDS: Record<string, string> = {
  "水管": "PIPE_BURST", "喉": "PIPE_BURST", "漏水": "PIPE_BURST",
  "裝修": "RENOVATION", "設計": "RENOVATION",
  "食飯": "EAT_BUDDY", "陪食": "EAT_BUDDY",
  "醫生": "DOCTOR_ESCORT", "診": "DOCTOR_ESCORT", "醫院": "DOCTOR_ESCORT",
  "行山": "HIKING_BUDDY", "運動": "HIKING_BUDDY",
  "母親": "VISIT_ELDERLY", "探": "VISIT_ELDERLY", "老人家": "VISIT_ELDERLY",
  "煮": "COOKING", "飯": "COOKING",
  "傾偈": "CHAT", "聊天": "CHAT",
  "冷氣": "AC_CLEAN", "洗冷氣": "AC_CLEAN",
  "搬": "MOVING", "屋": "MOVING",
  "搭火": "JUMPSTART", "車": "JUMPSTART",
  "鎖": "LOCKSMITH", "匙": "LOCKSMITH",
  "補習": "TUTORING", "教": "TUTORING",
  "按摩": "MASSAGE", "骨": "MASSAGE",
  "狗": "DOG_WALK", "寵物": "DOG_WALK",
  "送": "DELIVERY", "快遞": "DELIVERY",
  "排隊": "QUEUE", "飛": "QUEUE",
  "影相": "PHOTO", "攝影": "PHOTO",
  "電腦": "TECH_SUPPORT", "wifi": "TECH_SUPPORT",
  "法律": "LEGAL", "律師": "LEGAL",
};

export const generateScenarioData = (keywordKey: string) => {
  let modes: ServiceMode[] = [];
  let providers: Provider[] = [];
  let steps: TaskStep[] = [];
  let category = "GENERAL";

  switch (keywordKey) {
    case "PIPE_BURST":
      category = "HOME_REPAIR";
      modes = [
        { id: 'm1', name: '視像急救 (AR)', description: '專家透過鏡頭指導止水', estimatedPrice: '$80', estimatedTime: '即時', icon: 'Video' },
        { id: 'm2', name: '附近師傅 (快)', description: '最近的持牌水喉匠', estimatedPrice: '$600-$800', estimatedTime: '20分鐘', icon: 'Zap' },
        { id: 'm3', name: '工程公司 (保養)', description: '正規公司，含一個月保養', estimatedPrice: '$1200+', estimatedTime: '預約', icon: 'Briefcase' },
      ];
      steps = [
        { id: 's1', title: 'AR 診斷災情', status: 'ACTIVE', action: 'OPEN_CAMERA' },
        { id: 's2', title: '配對師傅', status: 'PENDING' },
        { id: 's3', title: '確認報價 (含零件)', status: 'PENDING' },
        { id: 's4', title: '上門維修', status: 'PENDING' },
        { id: 's5', title: '驗收放款', status: 'PENDING' }
      ];
      break;

    case "EAT_BUDDY":
      category = "SOCIAL";
      modes = [
        { id: 'm1', name: '吹水朋友', description: '輕鬆聊天，AA制', estimatedPrice: '$0 (請客)', estimatedTime: '15分鐘', icon: 'Coffee' },
        { id: 'm2', name: '美食導遊', description: '帶你去食好西', estimatedPrice: '$200/hr', estimatedTime: '預約', icon: 'Map' },
        { id: 'm3', name: '商務飯局', description: '形象得體，懂餐桌禮儀', estimatedPrice: '$500/hr', estimatedTime: '預約', icon: 'Tie' },
      ];
      steps = [
        { id: 's1', title: '確認餐廳/口味', status: 'ACTIVE' },
        { id: 's2', title: '選擇伴侶', status: 'PENDING' },
        { id: 's3', title: '安全認證 (KYC)', status: 'PENDING', action: 'VERIFY_ID' },
        { id: 's4', title: '見面用餐', status: 'PENDING' },
        { id: 's5', title: '互評', status: 'PENDING' }
      ];
      break;
    
    case "RENOVATION":
        category = "CONSTRUCTION";
        modes = [
            { id: 'm1', name: '局部翻新', description: '油漆、地板更換', estimatedPrice: '$5000+', estimatedTime: '3-5天', icon: 'PaintRoller' },
            { id: 'm2', name: '全屋裝修 (競價)', description: '多位師傅同時報價', estimatedPrice: '$20萬+', estimatedTime: '2個月', icon: 'Home', isBidding: true }, // Added isBidding
            { id: 'm3', name: '物料直供', description: '只買料，自己搵人做', estimatedPrice: '按量', estimatedTime: '3天', icon: 'Truck' },
        ];
        steps = [
            { id: 's1', title: '上傳圖則/AR度尺', status: 'ACTIVE', action: 'OPEN_CAMERA' },
            { id: 's2', title: '等待多人報價', status: 'PENDING' },
            { id: 's3', title: '簽署智能合約', status: 'PENDING' },
            { id: 's4', title: '分階段施工', status: 'PENDING' },
            { id: 's5', title: '完工保養', status: 'PENDING' }
        ];
        break;

    case "DOCTOR_ESCORT":
        category = "CARE";
        modes = [
            { id: 'm1', name: '鄰里互助', description: '附近街坊，簡單陪伴', estimatedPrice: '$100/次', estimatedTime: '即時', icon: 'Users' },
            { id: 'm2', name: '專業看護', description: '持牌護理員，可協助如廁', estimatedPrice: '$180/hr', estimatedTime: '30分鐘', icon: 'Heart' },
            { id: 'm3', name: '專車接送', description: '連人帶車點對點', estimatedPrice: '$400/次', estimatedTime: '預約', icon: 'Car' },
        ];
        steps = [
            { id: 's1', title: '確認覆診資料', status: 'ACTIVE' },
            { id: 's2', title: '開啟保險盾', status: 'PENDING', action: 'ACTIVATE_INSURANCE' },
            { id: 's3', title: '配對專員', status: 'PENDING' },
            { id: 's4', title: '全程實時追蹤', status: 'PENDING' },
            { id: 's5', title: '安全到家確認', status: 'PENDING' }
        ];
        break;

    default: // Generic fallback
      category = "GENERAL";
      modes = [
        { id: 'm1', name: '快速協助', description: '最快到達', estimatedPrice: '議價', estimatedTime: '30分鐘', icon: 'Zap' },
        { id: 'm2', name: '專業服務', description: '高評分保證', estimatedPrice: '市價', estimatedTime: '60分鐘', icon: 'Star' },
      ];
      steps = [
        { id: 's1', title: '確認需求', status: 'ACTIVE' },
        { id: 's2', title: '尋找幫手', status: 'PENDING' },
        { id: 's3', title: '執行任務', status: 'PENDING' },
        { id: 's4', title: '完成', status: 'PENDING' }
      ];
      break;
  }

  // Generate some mock providers relative to a center point
  const mockProviders: Provider[] = Array(4).fill(0).map((_, i) => ({
    id: `p-${Date.now()}-${i}`,
    name: ['陳師傅', 'Mary姐', '快修公司', 'David'][i],
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${i + keywordKey}`,
    profession: category,
    type: i === 2 ? 'COMPANY' : 'INDIVIDUAL',
    rating: (4 + Math.random()),
    distance: `${(0.5 + Math.random()).toFixed(1)}km`,
    coordinates: { lat: (Math.random() - 0.5) * 0.01, lng: (Math.random() - 0.5) * 0.01 },
    badges: i === 2 ? ['Verified', 'Insured'] : ['Verified'],
    isAvailable: true,
    basePrice: 100 * (i + 1)
  }));

  return { modes, steps, providers, category };
};
