import { User, Building, CheckRecord } from '@/types';

export const MOCK_USERS: User[] = [
  { id: 'student-1', name: '홍길동', role: 'student', grade: 1, classNum: 2, studentNum: 15, admissionYear: 2025 },
  { id: 'student-2', name: '김민준', role: 'student', grade: 1, classNum: 1, studentNum: 3, admissionYear: 2025 },
  { id: 'student-3', name: '이서연', role: 'student', grade: 2, classNum: 3, studentNum: 8, admissionYear: 2024 },
  { id: 'student-4', name: '박지호', role: 'student', grade: 3, classNum: 2, studentNum: 21, admissionYear: 2023 },
  { id: 'student-5', name: '최유나', role: 'student', grade: 2, classNum: 1, studentNum: 11, admissionYear: 2024 },
  { id: 'student-6', name: '정도윤', role: 'student', grade: 1, classNum: 3, studentNum: 7, admissionYear: 2025 },
  { id: 'student-7', name: '강서준', role: 'student', grade: 3, classNum: 1, studentNum: 4, admissionYear: 2023 },
  { id: 'student-8', name: '윤하은', role: 'student', grade: 2, classNum: 2, studentNum: 19, admissionYear: 2024 },
  { id: 'admin-1', name: '이담임', role: 'admin' },
];

const mk = (id: string, name: string, floorId: string, buildingId: string, buildingName: string, floorLabel: string) =>
  ({ id, name, floorId, buildingId, buildingName, floorLabel });

export const MOCK_BUILDINGS: Building[] = [
  {
    id: 'building-school',
    name: '코딩관',
    floors: [
      {
        id: 'floor-school-2', number: 2, label: '2층',
        rooms: [
          mk('room-s-201', '컴퓨터 실습실 (컴실)', 'floor-school-2', 'building-school', '코딩관', '2층'),
          mk('room-s-202', 'NCS게임콘텐츠제작실습실2', 'floor-school-2', 'building-school', '코딩관', '2층'),
          mk('room-s-203', 'LAB 1', 'floor-school-2', 'building-school', '코딩관', '2층'),
          mk('room-s-204', 'LAB 2', 'floor-school-2', 'building-school', '코딩관', '2층'),
          mk('room-s-205', 'LAB 3', 'floor-school-2', 'building-school', '코딩관', '2층'),
        ],
      },
      {
        id: 'floor-school-3', number: 3, label: '3층',
        rooms: [
          mk('room-s-301', 'NCS인공지능모델링실습실1', 'floor-school-3', 'building-school', '코딩관', '3층'),
          mk('room-s-302', 'NCS인공지능모델링실습실2', 'floor-school-3', 'building-school', '코딩관', '3층'),
          mk('room-s-303', 'NCS응용프로그래밍실습실1', 'floor-school-3', 'building-school', '코딩관', '3층'),
          mk('room-s-304', 'LAB 5', 'floor-school-3', 'building-school', '코딩관', '3층'),
        ],
      },
      {
        id: 'floor-school-4', number: 4, label: '4층',
        rooms: [
          mk('room-s-401', 'NCS응용프로그래밍실습실2', 'floor-school-4', 'building-school', '코딩관', '4층'),
          mk('room-s-402', 'NCS게임콘텐츠제작실습실1', 'floor-school-4', 'building-school', '코딩관', '4층'),
          mk('room-s-403', '채움교실', 'floor-school-4', 'building-school', '코딩관', '4층'),
          mk('room-s-404', 'LAB 6 (소규모 활동실)', 'floor-school-4', 'building-school', '코딩관', '4층'),
          mk('room-s-405', 'LAB 7 (소규모 활동실)', 'floor-school-4', 'building-school', '코딩관', '4층'),
        ],
      },
    ],
  },
  {
    id: 'building-other',
    name: '기타',
    floors: [
      {
        id: 'floor-other-1', number: 1, label: '기타',
        rooms: [
          mk('room-other-1', '기타', 'floor-other-1', 'building-other', '기타', '기타'),
        ],
      },
    ],
  },
];

const today = new Date().toISOString().split('T')[0];
const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
const twoDaysAgo = new Date(Date.now() - 172800000).toISOString().split('T')[0];

export const MOCK_RECORDS: CheckRecord[] = [
  // 오늘 - student-2,3,4,5,7,8 체크완료 / student-1,6 미체크
  { id: 'rec-1', studentId: 'student-2', studentName: '김민준', grade: 1, classNum: 1, date: today, roomId: 'room-s-203', roomName: 'LAB 1', buildingName: '코딩관', floorLabel: '2층', checkedAt: '19:05', status: 'checked' },
  { id: 'rec-2', studentId: 'student-3', studentName: '이서연', grade: 2, classNum: 3, date: today, roomId: 'room-s-304', roomName: 'LAB 5', buildingName: '코딩관', floorLabel: '3층', checkedAt: '19:12', status: 'checked' },
  { id: 'rec-3', studentId: 'student-4', studentName: '박지호', grade: 3, classNum: 2, date: today, roomId: 'room-s-403', roomName: '채움교실', buildingName: '코딩관', floorLabel: '4층', checkedAt: '19:03', status: 'checked' },
  { id: 'rec-4', studentId: 'student-5', studentName: '최유나', grade: 2, classNum: 1, date: today, roomId: 'room-other-1', roomName: '기숙사', buildingName: '기타', floorLabel: '기타', checkedAt: '19:20', status: 'checked', reason: '기숙사 체류' },
  { id: 'rec-5', studentId: 'student-7', studentName: '강서준', grade: 3, classNum: 1, date: today, roomId: 'room-s-304', roomName: 'LAB 5', buildingName: '코딩관', floorLabel: '3층', checkedAt: '18:58', status: 'checked' },
  { id: 'rec-6', studentId: 'student-8', studentName: '윤하은', grade: 2, classNum: 2, date: today, roomId: 'room-s-201', roomName: '컴퓨터 실습실 (컴실)', buildingName: '코딩관', floorLabel: '2층', checkedAt: '19:08', status: 'checked' },
  { id: 'rec-u1', studentId: 'student-1', studentName: '홍길동', grade: 1, classNum: 2, date: today, roomId: '', roomName: '', buildingName: '', floorLabel: '', checkedAt: '', status: 'unchecked' },
  { id: 'rec-u2', studentId: 'student-6', studentName: '정도윤', grade: 1, classNum: 3, date: today, roomId: '', roomName: '', buildingName: '', floorLabel: '', checkedAt: '', status: 'unchecked' },

  // 어제
  { id: 'rec-y1', studentId: 'student-1', studentName: '홍길동', grade: 1, classNum: 2, date: yesterday, roomId: 'room-s-203', roomName: 'LAB 1', buildingName: '코딩관', floorLabel: '2층', checkedAt: '19:10', status: 'checked' },
  { id: 'rec-y2', studentId: 'student-2', studentName: '김민준', grade: 1, classNum: 1, date: yesterday, roomId: 'room-s-403', roomName: '채움교실', buildingName: '코딩관', floorLabel: '4층', checkedAt: '19:02', status: 'checked' },
  { id: 'rec-y3', studentId: 'student-3', studentName: '이서연', grade: 2, classNum: 3, date: yesterday, roomId: 'room-s-304', roomName: 'LAB 5', buildingName: '코딩관', floorLabel: '3층', checkedAt: '19:15', status: 'checked' },
  { id: 'rec-y4', studentId: 'student-4', studentName: '박지호', grade: 3, classNum: 2, date: yesterday, roomId: '', roomName: '', buildingName: '', floorLabel: '', checkedAt: '', status: 'unchecked' },
  { id: 'rec-y5', studentId: 'student-5', studentName: '최유나', grade: 2, classNum: 1, date: yesterday, roomId: 'room-other-1', roomName: '기숙사', buildingName: '기타', floorLabel: '기타', checkedAt: '19:30', status: 'checked', reason: '기숙사 체류' },
  { id: 'rec-y6', studentId: 'student-6', studentName: '정도윤', grade: 1, classNum: 3, date: yesterday, roomId: 'room-s-205', roomName: 'LAB 3', buildingName: '코딩관', floorLabel: '2층', checkedAt: '18:55', status: 'checked' },
  { id: 'rec-y7', studentId: 'student-7', studentName: '강서준', grade: 3, classNum: 1, date: yesterday, roomId: 'room-s-203', roomName: 'LAB 1', buildingName: '코딩관', floorLabel: '2층', checkedAt: '19:00', status: 'checked' },
  { id: 'rec-y8', studentId: 'student-8', studentName: '윤하은', grade: 2, classNum: 2, date: yesterday, roomId: 'room-s-201', roomName: '컴퓨터 실습실 (컴실)', buildingName: '코딩관', floorLabel: '2층', checkedAt: '19:22', status: 'checked' },

  // 2일전
  { id: 'rec-d1', studentId: 'student-1', studentName: '홍길동', grade: 1, classNum: 2, date: twoDaysAgo, roomId: 'room-s-304', roomName: 'LAB 5', buildingName: '코딩관', floorLabel: '3층', checkedAt: '19:07', status: 'checked' },
  { id: 'rec-d2', studentId: 'student-2', studentName: '김민준', grade: 1, classNum: 1, date: twoDaysAgo, roomId: 'room-s-203', roomName: 'LAB 1', buildingName: '코딩관', floorLabel: '2층', checkedAt: '19:01', status: 'checked' },
  { id: 'rec-d3', studentId: 'student-3', studentName: '이서연', grade: 2, classNum: 3, date: twoDaysAgo, roomId: '', roomName: '', buildingName: '', floorLabel: '', checkedAt: '', status: 'unchecked' },
  { id: 'rec-d4', studentId: 'student-4', studentName: '박지호', grade: 3, classNum: 2, date: twoDaysAgo, roomId: 'room-s-401', roomName: 'NCS응용프로그래밍실습실2', buildingName: '코딩관', floorLabel: '4층', checkedAt: '19:18', status: 'checked' },
  { id: 'rec-d5', studentId: 'student-5', studentName: '최유나', grade: 2, classNum: 1, date: twoDaysAgo, roomId: 'room-other-1', roomName: '병원', buildingName: '기타', floorLabel: '기타', checkedAt: '19:40', status: 'checked', reason: '병원 방문' },
];
