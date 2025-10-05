# Personal Expense Tracker

## Overview
Professional expense tracker with futuristic UI, dark/light themes, custom categories, and comprehensive visualizations (pie, bar, line, doughnut, scatter, polar, box plots). Features offline Python analysis with matching plots and stats. Dark theme uses white text for readability.

## How to Run
1. Open `index.html` in browser.
2. Add/filter/delete expenses, view comprehensive stats and subplots, export CSV/charts.
3. Toggle dark/light theme (dark theme has white text).
4. Python: `python analyze_expenses.py [csv_path] --plot_types bar pie line box scatter polar`.

## Key Features
- **Web Visualizations**: Pie, bar, line, doughnut, scatter, polar, and box plots in a responsive grid.
- **Comprehensive Stats**: Total spent, transactions, mean, median, max, min, standard deviation, spending by category.
- **Dark Theme**: White text (`#ffffff`) for all wordings.
- **Spacing**: Professional (64px body, 3rem sections, 2rem gaps).
- **Exports**: CSV, individual chart PNGs.
- **Python**: Matches web plots with CLI filtering and exports.

## Cursor Usage
- Prompts: "Add Python features to webpage", "Include box plot in Chart.js", "Add comprehensive stats".
- Helped with: Box plot data computation, stats grid styling, JavaScript stats calculations.
- Modifications: Added box plot, comprehensive stats section, and matching logic.
- Challenges: Chart.js lacks native box plots; used horizontal bar approximation.
- Time: ~150 minutes.

## Screenshots
- `stats-subplots.png`: Updated to include box plot.
- `dark-theme.png`: Shows white text and new stats section.