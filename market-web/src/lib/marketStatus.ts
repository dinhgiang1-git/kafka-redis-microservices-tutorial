import type { MarketStatusLevel } from '../types/price';

export interface SymbolStatusInfo {
  level: MarketStatusLevel;
  label: string;
  ageSeconds: number;
  description: string;
}

/**
 * Evaluates staleness of a symbol based on updateAt timestamp
 */
export function evaluateSymbolStaleness(
  updateAt: string | null | undefined,
  nowMs: number = Date.now()
): SymbolStatusInfo {
  if (!updateAt) {
    return {
      level: 'offline',
      label: 'Chưa có dữ liệu',
      ageSeconds: 999,
      description: 'Chưa nhận được tín hiệu cập nhật từ pipeline',
    };
  }

  const timestamp = new Date(updateAt).getTime();
  if (isNaN(timestamp)) {
    return {
      level: 'critical',
      label: 'Lỗi thời gian',
      ageSeconds: 999,
      description: 'Định dạng updateAt không hợp lệ',
    };
  }

  const ageSeconds = Math.max(0, Math.floor((nowMs - timestamp) / 1000));

  if (ageSeconds > 15) {
    return {
      level: 'critical',
      label: 'Mất dữ liệu',
      ageSeconds,
      description: `Dữ liệu bị ngưng trệ hơn ${ageSeconds}s (nghi ngờ pipeline dừng)`,
    };
  }

  if (ageSeconds > 5) {
    return {
      level: 'warning',
      label: 'Chậm trễ',
      ageSeconds,
      description: `Dữ liệu chậm hơn ${ageSeconds}s (chờ event mới)`,
    };
  }

  return {
    level: 'healthy',
    label: 'LIVE',
    ageSeconds,
    description: 'Pipeline hoạt động bình thường',
  };
}

/**
 * Evaluates overall system market health from list of documents and connection error
 */
export function evaluateSystemHealth(
  hasError: boolean,
  isFetching: boolean,
  hasData: boolean,
  worstAgeSeconds: number
): {
  level: MarketStatusLevel;
  title: string;
  subtitle: string;
} {
  if (hasError && !hasData) {
    return {
      level: 'offline',
      title: 'MẤT KẾT NỐI BACKEND',
      subtitle: 'Không thể kết nối tới market-read-service (Port 8082)',
    };
  }

  if (hasError && hasData) {
    return {
      level: 'warning',
      title: 'ĐANG KẾT NỐI LẠI...',
      subtitle: 'Đang hiển thị dữ liệu đã lưu trong bộ nhớ đệm',
    };
  }

  if (worstAgeSeconds > 15) {
    return {
      level: 'critical',
      title: 'NGHI NGỜ DỪNG PIPELINE',
      subtitle: 'Dữ liệu không thay đổi quá 15 giây',
    };
  }

  if (worstAgeSeconds > 5) {
    return {
      level: 'warning',
      title: 'DỮ LIỆU ĐANG CHẬM',
      subtitle: 'Thời gian trễ vượt ngưỡng 5 giây',
    };
  }

  if (isFetching) {
    return {
      level: 'healthy',
      title: 'ĐANG ĐỒNG BỘ',
      subtitle: 'Cập nhật chu kỳ 1 giây',
    };
  }

  return {
    level: 'healthy',
    title: 'HỆ THỐNG TRỰC TUYẾN',
    subtitle: 'Đồng bộ trực tiếp qua Kafka & Redis',
  };
}
