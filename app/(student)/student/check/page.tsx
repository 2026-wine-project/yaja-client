'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { CheckCircle2, Loader2, Building2, ChevronRight, GraduationCap, Pencil } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { submitCheck, fetchTodayRecord } from '@/lib/slices/checkSlice';
import { getBuildingsAPI } from '@/lib/api';
import { Building, Room } from '@/types';

const CLASSROOM_BUILDING_ID = 'building-classroom';
const OTHER_BUILDING_ID = 'building-other';

const TAB_ICONS: Record<string, React.ComponentType<{ className?: string; strokeWidth?: number }>> = {
  [CLASSROOM_BUILDING_ID]: GraduationCap,
  'building-school': Building2,
  [OTHER_BUILDING_ID]: Pencil,
};

export default function CheckPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((s) => s.auth);
  const { todayRecord, loading } = useAppSelector((s) => s.check);

  const todayStr = new Date().toISOString().split('T')[0];

  const [buildings, setBuildings] = useState<Building[]>([]);
  const [activeBuilding, setActiveBuilding] = useState<string>('');
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [customLocation, setCustomLocation] = useState('');
  const [reason, setReason] = useState('');

  useEffect(() => {
    getBuildingsAPI().then((b) => {
      if (user?.grade && user?.classNum) {
        const classroomBuilding: Building = {
          id: CLASSROOM_BUILDING_ID,
          name: '교실',
          floors: [{
            id: 'floor-classroom',
            number: 0,
            label: `${user.grade}학년 ${user.classNum}반`,
            rooms: [{
              id: `classroom-${user.grade}-${user.classNum}`,
              name: `${user.grade}학년 ${user.classNum}반 교실`,
              floorId: 'floor-classroom',
              buildingId: CLASSROOM_BUILDING_ID,
              buildingName: '교실',
              floorLabel: `${user.grade}학년 ${user.classNum}반`,
            }],
          }],
        };
        setBuildings([classroomBuilding, ...b]);
        setActiveBuilding(CLASSROOM_BUILDING_ID);
      } else {
        setBuildings(b);
        setActiveBuilding(b[0]?.id ?? '');
      }
    });
    if (user) dispatch(fetchTodayRecord({ studentId: user.id, date: todayStr }));
  }, [user, todayStr, dispatch]);

  // 기존 체크 기록 복원
  useEffect(() => {
    if (todayRecord?.status === 'checked' && todayRecord.roomId && buildings.length) {
      const room = buildings.flatMap((b) => b.floors.flatMap((f) => f.rooms)).find((r) => r.id === todayRecord.roomId);
      if (room) {
        setSelectedRoom(room);
        setActiveBuilding(room.buildingId);
        if (todayRecord.reason) setReason(todayRecord.reason);
        if (room.buildingId === OTHER_BUILDING_ID) setCustomLocation(todayRecord.roomName);
      }
    }
  }, [todayRecord, buildings]);

  function handleBuildingChange(buildingId: string) {
    setActiveBuilding(buildingId);
    setCustomLocation('');
    setReason('');
    if (buildingId === OTHER_BUILDING_ID) {
      const b = buildings.find((b) => b.id === OTHER_BUILDING_ID);
      const room = b?.floors[0]?.rooms[0] ?? null;
      setSelectedRoom(room);
    } else if (selectedRoom?.buildingId === OTHER_BUILDING_ID) {
      setSelectedRoom(null);
    }
  }

  const currentBuilding = buildings.find((b) => b.id === activeBuilding);
  const isOther = activeBuilding === OTHER_BUILDING_ID;
  const isDisabled = !selectedRoom || loading || (isOther && !customLocation.trim());

  async function handleSubmit() {
    if (!selectedRoom || !user) { toast.warn('장소를 선택해주세요.'); return; }
    if (isOther && !customLocation.trim()) { toast.warn('장소 이름을 입력해주세요.'); return; }

    const result = await dispatch(submitCheck({
      studentId: user.id,
      date: todayStr,
      roomId: selectedRoom.id,
      reason: reason.trim() || undefined,
      customLocation: isOther ? customLocation.trim() : undefined,
    }));

    if (submitCheck.fulfilled.match(result)) {
      const loc = isOther
        ? `${customLocation.trim()}${reason.trim() ? ` (${reason.trim()})` : ''}`
        : `${selectedRoom.buildingName} ${selectedRoom.floorLabel} ${selectedRoom.name}`;
      toast.success(`✅ ${loc} 체크 완료!`);
      router.push('/student');
    } else {
      toast.error('체크에 실패했습니다.');
    }
  }

  const submitLabel = loading
    ? '등록 중...'
    : isOther
    ? (customLocation.trim() ? `${customLocation.trim()} 으로 체크` : '장소 이름을 입력하세요')
    : !selectedRoom
    ? '장소를 선택하세요'
    : `${selectedRoom.name} 으로 체크`;

  return (
    <div className="flex flex-col h-full">
      <div className="px-5 py-5 flex flex-col gap-4 flex-1 min-h-0">
        {/* 헤더 */}
        <div>
          <h2 className="text-xl font-bold" style={{ color: 'var(--text-1)' }}>위치 선택</h2>
          <p className="text-xs mt-1" style={{ color: 'var(--text-3)' }}>오늘 야자할 장소를 선택하세요</p>
        </div>

        {/* 현재 선택 표시 (일반 건물만) */}
        {selectedRoom && !isOther && (
          <div className="flex items-center gap-3 px-4 py-3 rounded-2xl" style={{ background: 'var(--brand-light)', border: '1.5px solid var(--brand-mid)' }}>
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--brand)' }} />
            <div className="flex-1 min-w-0">
              <p className="text-xs" style={{ color: 'var(--brand-mid)' }}>선택된 장소</p>
              <p className="text-sm font-semibold truncate" style={{ color: 'var(--brand)' }}>
                {selectedRoom.buildingName} {selectedRoom.floorLabel} · {selectedRoom.name}
              </p>
            </div>
          </div>
        )}

        {/* 건물 탭 - 3열 그리드 */}
        {buildings.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {buildings.map((b) => {
              const Icon = TAB_ICONS[b.id] ?? Building2;
              const isActive = activeBuilding === b.id;
              return (
                <button key={b.id} onClick={() => handleBuildingChange(b.id)}
                  className="flex flex-col items-center justify-center gap-1 py-2.5 rounded-xl text-xs font-medium transition-all"
                  style={isActive
                    ? { background: 'var(--brand)', color: '#fff' }
                    : { background: 'var(--surface-1)', color: 'var(--text-2)', border: '1px solid var(--border)' }}>
                  <Icon className="w-4 h-4" strokeWidth={isActive ? 2.2 : 1.8} />
                  {b.name}
                </button>
              );
            })}
          </div>
        )}

        {/* 기타: 장소 이름 + 사유 입력 */}
        {isOther ? (
          <div className="flex flex-col gap-4 flex-1">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold" style={{ color: 'var(--text-1)' }}>
                장소 이름
                <span className="ml-1.5 text-xs font-normal" style={{ color: 'var(--danger, #ef4444)' }}>*필수</span>
              </label>
              <input
                type="text"
                value={customLocation}
                onChange={(e) => setCustomLocation(e.target.value)}
                placeholder="이동한 장소를 입력해주세요"
                className="w-full px-4 py-3 rounded-2xl text-sm outline-none transition-all"
                style={{ background: 'var(--surface-1)', border: '1px solid var(--border)', color: 'var(--text-1)' }}
                onFocus={(e) => { e.target.style.borderColor = 'var(--brand)'; }}
                onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; }}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold" style={{ color: 'var(--text-1)' }}>
                사유
                <span className="ml-1.5 text-xs font-normal" style={{ color: 'var(--text-3)' }}>(선택)</span>
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="사유를 입력해주세요"
                rows={4}
                className="w-full px-4 py-3 rounded-2xl text-sm resize-none outline-none transition-all"
                style={{ background: 'var(--surface-1)', border: '1px solid var(--border)', color: 'var(--text-1)' }}
                onFocus={(e) => { e.target.style.borderColor = 'var(--brand)'; }}
                onBlur={(e) => { e.target.style.borderColor = 'var(--border)'; }}
              />
            </div>
          </div>
        ) : (
          /* 일반 건물: 층별 호실 목록 */
          <div className="flex flex-col gap-3 flex-1 overflow-y-auto">
            {currentBuilding?.floors.map((floor) => (
              <div key={floor.id}>
                <div className="flex items-center gap-2 mb-2 px-1">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-lg" style={{ background: 'var(--surface-3)', color: 'var(--text-2)' }}>
                    {floor.label}
                  </span>
                  <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
                </div>
                <div className="flex flex-col gap-2">
                  {floor.rooms.map((room) => {
                    const isSelected = selectedRoom?.id === room.id;
                    return (
                      <button key={room.id} onClick={() => setSelectedRoom(room)}
                        className="w-full flex items-center justify-between px-4 py-3.5 rounded-2xl text-sm font-medium text-left transition-all"
                        style={isSelected
                          ? { background: 'var(--brand-light)', border: '1.5px solid var(--brand-mid)', color: 'var(--brand)' }
                          : { background: 'var(--surface-1)', border: '1px solid var(--border)', color: 'var(--text-1)' }}>
                        <span>{room.name}</span>
                        {isSelected
                          ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--brand)' }} />
                          : <ChevronRight className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--text-3)' }} />}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 하단 확인 버튼 */}
      <div className="px-5 py-4" style={{ borderTop: '1px solid var(--border)', background: 'var(--surface-1)' }}>
        <button onClick={handleSubmit} disabled={isDisabled}
          className="w-full py-4 rounded-2xl text-sm font-semibold text-white flex items-center justify-center gap-2 transition-opacity"
          style={{ background: isDisabled ? 'var(--text-3)' : 'var(--brand)', opacity: loading ? 0.7 : 1 }}>
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
          {submitLabel}
        </button>
      </div>
    </div>
  );
}
