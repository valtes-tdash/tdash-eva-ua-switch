// User-Agent から端末 OS を判定する（モバイルWeb検証用）。
//
// 返り値は 'android' | 'ios' | 'other'。
// - Android: UA に "Android" を含む
// - iOS: UA に "iPhone" / "iPod" / "iPad" を含む
//        （iPadOS 13+ は Safari が "Macintosh" を名乗るため、タッチ対応 Mac も iOS 扱いにする）
// - other: 上記以外（PC ブラウザ等）
export function detectOS(userAgent) {
  const ua = userAgent ?? (typeof navigator !== 'undefined' ? navigator.userAgent : '');

  if (/android/i.test(ua)) return 'android';
  if (/iphone|ipod|ipad/i.test(ua)) return 'ios';

  // iPadOS 13+ は Mac の UA を返すが、タッチポイントで実機 iPad を見分ける
  if (
    /macintosh/i.test(ua) &&
    typeof navigator !== 'undefined' &&
    navigator.maxTouchPoints > 1
  ) {
    return 'ios';
  }

  return 'other';
}

// 判定結果の表示ラベル
export function osLabel(os) {
  switch (os) {
    case 'android':
      return 'Android版';
    case 'ios':
      return 'iOS版';
    default:
      return 'その他（PC等）';
  }
}
