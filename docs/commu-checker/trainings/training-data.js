'use strict';

const TRAINING_TYPES = [
  "d1",
  "d2",
  "m1",
  "m2",
  "r1",
  "r2",
  "r3",
  "s1",
  "s2",
  "s3"
];

const TRAINING_PAGES = (() => {
  const parts = window.TRAINING_PAGE_PARTS || {};
  const pages = {};
  TRAINING_TYPES.forEach((type) => {
    if (parts[type]) {
      pages[type] = parts[type];
    }
  });
  return pages;
})();
