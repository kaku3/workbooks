#!/usr/bin/env python
# -*- coding: utf-8 -*-

# 国立社会保障・人口問題研究所
# 人口ピラミッドのデータ（1965～2065年）

import pandas as pd
import bar_chart_race as bcr
import japanize_matplotlib

file = 'population'

df = pd.read_csv(f'data/{file}.csv', index_col=0, parse_dates=[0])

bcr.bar_chart_race(
    df=df, 
    filename=f'./data/{file}.gif', 
    orientation='v', 
    sort='asc',
    fixed_order=False, 
    fixed_max=True,
    steps_per_period=15,
    period_length=900,
    title='出典 : 国立社会保障・人口問題研究所\n人口ピラミッドのデータ（1965～2065年）(単位1,000人)', 
    bar_size=.95, 
    shared_fontdict=None, 
    scale='linear', 
    fig=None,
    figsize=(2.5, 2),
    writer=None, 
    bar_kwargs={'alpha': .7},
    filter_column_colors=False,
    title_size=5,
    bar_label_size=5,
    tick_label_size=5
)
