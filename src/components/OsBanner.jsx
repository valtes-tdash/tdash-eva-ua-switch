import React from 'react';
import { detectOS, osLabel } from '../utils/detectOS';

// 検出した OS を画面上に明示するバナー。
// 自動テストから判定できるよう data 属性を付与する：
//   - data-testid="detected-os" / data-os="android|ios|other"
//   - data-testid="detected-ua" に生の User-Agent
const OsBanner = () => {
  const os = detectOS();
  const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';

  return (
    <div className={`os-banner os-banner-${os}`} data-testid="detected-os" data-os={os}>
      <span className="os-banner-badge">{osLabel(os)}</span>
      <span className="os-banner-text">User-Agent により表示を切り替えています</span>
      <code className="os-banner-ua" data-testid="detected-ua">
        {ua}
      </code>
    </div>
  );
};

export default OsBanner;
