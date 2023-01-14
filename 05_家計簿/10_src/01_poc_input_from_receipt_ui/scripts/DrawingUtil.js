export default class DrawingUtil {

  /**
   * 凸包を求める
   * ギフト包装法
   * 1. 最もy座標が小さく、その中でxも最も小さいものを求めて注目点とする
   * 2. 次の点を求めるために、注目点ほか全ての点との偏角を求めて、最も左にあるものを選ぶ.
   * 3. 一周するまで繰り返す.
   *
   * @param {*} points
   * @returns
   */
  static toConvexHull(points) {
    let convexHullPoints = [];

    if (points.length < 3) {
      return convexHullPoints;
    }

    let basePoint = points[0];
    points.forEach(point => {
      if (basePoint.y > point.y || ((basePoint.y == point.y) && basePoint.x > point.x)) {
        basePoint = point;
      }
    });

    let currentPoint = basePoint;
    do {
      convexHullPoints.push(currentPoint);
      currentPoint = DrawingUtil.nextPoint(points, currentPoint);
    } while(basePoint != currentPoint);
    convexHullPoints.push(basePoint);

    return convexHullPoints;
  }

  static nextPoint(points, p) {
    let nextPoint = points[0];
    for (let i = 1, max = points.length; i < max; i++) {
      let point = points[i];
      if (p == nextPoint) {
        nextPoint = point;
      } else {
        let v = (p.x - nextPoint.x) * (p.y - point.y) - (p.x - point.x) * (p.y - nextPoint.y);
        let ab = (p.x - nextPoint.x) * (p.x - nextPoint.x) + (p.y - nextPoint.y) * (p.y - nextPoint.y);
        let ac = (p.x - point.x) * (p.x - point.x) + (p.y - point.y) * (p.y - point.y);
        if (v > 0 || (v == 0 && Math.abs(ac) > Math.abs(ab))) {
          nextPoint = point;
        }
      }
    }
    return nextPoint;
  }
}
