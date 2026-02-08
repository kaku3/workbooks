// 問題ファイルの一覧
export const SAMPLE_PROBLEMS = [
  // 初級
  'problems/syntax_error.json',
  'problems/comment_syntax.json',
  'problems/variable_typo.json',
  'problems/greeting_message.json',
  'problems/infinite_loop.json',
  'problems/off_by_one.json',
  'problems/comparison_operator.json',
  'problems/type_conversion.json',
  'problems/null_check.json',
  // 中級
  'problems/multiple_functions.json',
  'problems/callback_bug.json',
  'problems/array_method_bug.json',
  'problems/closure_bug.json',
  'problems/object_mutation.json',
  'problems/scope_bug.json',
  'problems/this_binding.json',
  // 上級
  'problems/chained_errors.json',
  'problems/event_handling.json',
  'problems/recursion_bug.json',
  'problems/wrong_diagnosis.json',
  'problems/overcomplicated_logic.json',
  'problems/misleading_names.json',
  'problems/copy_paste_bug.json',
  'problems/unnecessary_conversion.json',
  'problems/flag_hell.json'
];

// ローカルストレージのキー
export const STORAGE_KEY = 'bug_platform_learning_log';

// 難易度ラベル
export const LEVEL_LABELS = {
  beginner: '初級',
  intermediate: '中級',
  advanced: '上級'
} as const;
