const COEFFICIENT = 24 * 60 * 60 * 1000 // 日数とミリ秒を変換する係数

const DATES_OFFSET = 70 * 365 + 17 + 1 + 1 // 「1900/1/0」～「1970/1/1」 (日数)
const MILLIS_DIFFERENCE = 9 * 60 * 60 * 1000 // UTCとJSTの時差 (ミリ秒)

module.exports = class ExcelDate {
  static convertUt2Sn (unixTimeMillis) {
    // UNIX時間(ミリ秒)→シリアル値
    return (unixTimeMillis + MILLIS_DIFFERENCE) / COEFFICIENT + DATES_OFFSET
  }

  static convertSn2Ut (serialNumber) {
    // シリアル値→UNIX時間(ミリ秒)
    return (serialNumber - DATES_OFFSET) * COEFFICIENT - MILLIS_DIFFERENCE
  }

  static dateFromSn (serialNumber) {
    // シリアル値→Date
    return new Date(ExcelDate.convertSn2Ut(serialNumber))
  }

  static dateToSn (date) {
    // Date→シリアル値
    return ExcelDate.convertUt2Sn(date.getTime())
  }
}
