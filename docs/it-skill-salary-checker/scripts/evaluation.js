// ここを追加
if (typeof skillCategories !== 'undefined') {
  window.skillCategories = skillCategories;
}

// ユーザー評価値と各職種のモデル値の距離を計算
function calculateDistance(userValues, roleValues) {
  if (!userValues || !roleValues || userValues.length !== roleValues.length) {
    return Infinity;
  }
  
  // ユークリッド距離（二乗和の平方根）を計算
  let sumSquaredDiffs = 0;
  for (let i = 0; i < userValues.length; i++) {
    const diff = userValues[i] - roleValues[i];
    sumSquaredDiffs += diff * diff;
  }
  
  return Math.sqrt(sumSquaredDiffs);
}

// 職種のモデル値を取得
function getRoleModelValues(role) {
  return skillSet.map(s => s.samples[role] ?? 0);
}

// 最も近い職種を判定
function findClosestRole(userValues) {
  const roles = ['tester', 'tester-adv', 'pg', 'se', 'plpm', 'consultant'];
  let closestRole = '';
  let minDistance = Infinity;
  
  roles.forEach(role => {
    const roleValues = getRoleModelValues(role);
    const distance = calculateDistance(userValues, roleValues);
    
    if (distance < minDistance) {
      minDistance = distance;
      closestRole = role;
    }
  });
  
  return closestRole;
}

// モデル値との差分平均を計算
function calculateAverageDifference(userValues, role) {
  const roleValues = getRoleModelValues(role);
  let totalDiff = 0;
  
  userValues.forEach((value, index) => {
    totalDiff += value - roleValues[index];
  });
  
  return totalDiff / userValues.length;
}

// 強みと弱みを分析
function analyzeStrengthsAndWeaknesses(userValues, role) {
  const roleValues = getRoleModelValues(role);
  const strengths = [];
  const weaknesses = [];
  
  userValues.forEach((value, index) => {
    const diff = value - roleValues[index];
    const skill = skillSet[index];
    
    if (diff >= 15) {
      // 強みとして判定
      strengths.push({
        name: skill.name,
        group: skill.group,
        value: value,
        diff: diff
      });
    } else if (diff <= -15) {
      // 弱みとして判定
      weaknesses.push({
        name: skill.name,
        group: skill.group,
        value: value,
        diff: diff
      });
    }
  });
  
  // 差分の大きい順にソート
  strengths.sort((a, b) => b.diff - a.diff);
  weaknesses.sort((a, b) => a.diff - b.diff);
  
  return {
    strengths: strengths.slice(0, 3), // 上位3つの強み
    weaknesses: weaknesses.slice(0, 3) // 上位3つの弱み
  };
}

// 各カテゴリの平均点を計算
function calculateCategoryAverages(userValues) {
  const categories = {};
  
  skillSet.forEach((skill, index) => {
    if (!categories[skill.group]) {
      categories[skill.group] = { total: 0, count: 0 };
    }
    categories[skill.group].total += userValues[index];
    categories[skill.group].count++;
  });
  
  const result = {};
  for (const [group, data] of Object.entries(categories)) {
    result[group] = Math.round(data.total / data.count);
  }
  
  return result;
}

// 差分に基づいて称号を取得
function getTitleByDifference(difference) {
  for (const title of titles) {
    if (difference >= title.min && difference <= title.max) {
      return title;
    }
  }
  return titles[3]; // デフォルトは「平均的な」
}

// 年収レンジを取得（称号に応じた補正あり）
function getSalaryRange(role, titleMultiplier) {
  const baseRange = salaryRanges[role] || { min: 0, max: 0 };
  return {
    min: Math.round(baseRange.min * titleMultiplier),
    max: Math.round(baseRange.max * titleMultiplier),
    nextRole: baseRange.nextRole,
    nextRoleLabel: baseRange.nextRoleLabel
  };
}

// 総合評価を生成
function generateEvaluation(userValues) {
  // 総合点を計算
  const totalScore = Math.round(userValues.reduce((sum, val) => sum + val, 0) / userValues.length);

  // 低スコアの場合は「該当なし」評価
  if (totalScore < 40) {
    return {
      role: 'none',
      roleName: '',
      title: '未経験レベル',
      description: '現時点ではエンジニア職としてのスキルが十分ではありません。',
      advice: 'これからエンジニアを目指す方は、基礎的なITスキルやプログラミングの学習から始めましょう。オンライン教材や入門書、スクールなどを活用し、まずは小さなアプリやWebサイトを作ってみるのがおすすめです。焦らず一歩ずつスキルアップを目指しましょう。',
      salaryMin: 0,
      salaryMax: 0,
      nextRole: null,
      nextRoleLabel: null,
      averageDifference: null,
      strengths: [],
      weaknesses: [],
      categoryAverages: calculateCategoryAverages(userValues),
      totalScore: totalScore,
      salaryMultiplier: 0,
      userValues: userValues // ★ここを追加
    };
  }

  const closestRole = findClosestRole(userValues);
  const averageDiff = calculateAverageDifference(userValues, closestRole);
  const title = getTitleByDifference(averageDiff);
  const salaryRange = getSalaryRange(closestRole, title.salaryMultiplier);
  const roleName = roleNames[closestRole];
  const analysis = analyzeStrengthsAndWeaknesses(userValues, closestRole);
  const categoryAverages = calculateCategoryAverages(userValues);

  return {
    role: closestRole,
    roleName: roleName,
    title: title.name,
    description: title.description,
    advice: title.advice,
    salaryMin: salaryRange.min,
    salaryMax: salaryRange.max,
    nextRole: salaryRange.nextRole,
    nextRoleLabel: salaryRange.nextRoleLabel,
    averageDifference: averageDiff,
    strengths: analysis.strengths,
    weaknesses: analysis.weaknesses,
    categoryAverages: categoryAverages,
    totalScore: totalScore,
    salaryMultiplier: title.salaryMultiplier,
    userValues: userValues // ★ここを追加
  };
}

// 強み・弱みのHTML生成
function generateStrengthsWeaknessesHTML(strengths, weaknesses) {
  let html = '<div class="evaluation-analysis">';
  
  // 強み
  html += '<div class="strengths-section">';
  html += '<h4>あなたの強み</h4>';
  if (strengths.length > 0) {
    html += '<ul class="strengths-list">';
    strengths.forEach(item => {
      html += `<li><span class="skill-name">${item.name}</span> - <span class="skill-group">${skillCategories[item.group]}</span>：<span class="skill-diff positive">+${Math.round(item.diff)}点</span></li>`;
    });
    html += '</ul>';
  } else {
    html += '<p>特筆すべき強みはありません。全体的なスキルアップを目指しましょう。</p>';
  }
  html += '</div>';
  
  // 弱み
  html += '<div class="weaknesses-section">';
  html += '<h4>改善すべき点</h4>';
  if (weaknesses.length > 0) {
    html += '<ul class="weaknesses-list">';
    weaknesses.forEach(item => {
      html += `<li><span class="skill-name">${item.name}</span> - <span class="skill-group">${skillCategories[item.group]}</span>：<span class="skill-diff negative">${Math.round(item.diff)}点</span></li>`;
    });
    html += '</ul>';
  } else {
    html += '<p>大きな弱点は見当たりません。バランスの良いスキルセットです。</p>';
  }
  html += '</div>';
  
  html += '</div>';
  return html;
}

// カテゴリ別平均点のHTML生成
function generateCategoryAveragesHTML(categoryAverages, userValues) {
  let html = '<div class="category-averages">';
  html += '<h4>カテゴリ別平均点</h4>';
  html += '<ul class="category-list">';

  // 各カテゴリの合計点・項目数・ユーザー値リストを計算
  const categoryTotals = {};
  skillSet.forEach((skill, index) => {
    if (!categoryTotals[skill.group]) {
      categoryTotals[skill.group] = { total: 0, count: 0, values: [] };
    }
    categoryTotals[skill.group].count++;
    // userValuesが空配列の場合は0を入れる
    categoryTotals[skill.group].values.push(userValues && userValues.length ? userValues[index] : 0);
  });

  for (const [group, score] of Object.entries(categoryAverages)) {
    const categoryName = skillCategories[group];
    const count = categoryTotals[group]?.count || 0;
    const valuesArr = categoryTotals[group]?.values || [];
    const userSum = valuesArr.reduce((a, b) => a + b, 0);
    const userAvg = count > 0 ? Math.round(userSum / count) : 0;
    const maxSum = count * 100;
    html += `<li><span class="category-name">${categoryName}</span>: <span class="category-score">${userAvg}点</span> <span class="category-total">(${userSum}/${maxSum} : ${count}項目)</span></li>`;
  }

  html += '</ul>';
  html += '</div>';
  return html;
}

// 評価結果のHTMLを生成
function generateEvaluationHTML(evaluation) {
  let html = `<div class="evaluation-result">`;
  
  // 総合評価
  html += `<div class="evaluation-summary">`;
  html += `<h3>診断結果</h3>`;
  html += `<h2 class="evaluation-title">${evaluation.title}${evaluation.roleName}</h2>`;
  html += `<p class="evaluation-description">${evaluation.description}</p>`;
  html += `<p class="evaluation-salary">推定年収: <span class="salary-range">${evaluation.salaryMin}万円 〜 ${evaluation.salaryMax}万円</span></p>`;
  
  // 次のキャリアステップ
  if (evaluation.nextRole) {
    html += `<p class="next-role">次のキャリアステップ: <span class="role-name">${evaluation.nextRoleLabel}</span></p>`;
  }
  
  // 総合点
  html += `<p class="total-score">総合点: <span class="score">${evaluation.totalScore}</span></p>`;
  
  // 称号による年収効果
  const effect = ((evaluation.salaryMultiplier - 1) * 100).toFixed(2);
  if (evaluation.salaryMultiplier > 1) {
    html += `<p class="salary-effect positive">称号ボーナス: <span>+${effect}%</span></p>`;
  } else if (evaluation.salaryMultiplier < 1) {
    html += `<p class="salary-effect negative">年収調整: <span>${effect}%</span></p>`;
  }
  
  html += `</div>`;
  
  // アドバイス
  html += `<div class="evaluation-advice">`;
  html += `<h4>アドバイス</h4>`;
  html += `<p>${evaluation.advice}</p>`;
  html += `</div>`;
  
  // 強み・弱み分析
  html += generateStrengthsWeaknessesHTML(evaluation.strengths, evaluation.weaknesses);
  
  // カテゴリ別平均点
  html += generateCategoryAveragesHTML(evaluation.categoryAverages, evaluation.userValues || []);
  
  html += `</div>`;
  return html;
}
