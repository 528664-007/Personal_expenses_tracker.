# Personal_expenses_tracker.

This is a web-based Personal Expense Tracker application built with HTML, CSS, JavaScript, and Chart.js, with an additional Python script for alternative visualization. The project is structured with the following files:

index.html: The main HTML file containing the user interface and structure.
script.js: The JavaScript file handling logic, data management, and chart rendering.
styles.css: The CSS file for custom styling (optional but recommended for full experience).
expenses.py: A Python script for generating expense visualizations (e.g., scatter, polar, box plots) as an alternative or reference implementation.
README.md: This documentation file.

How to Run Your Application

Prerequisites:

A modern web browser (e.g., Chrome, Firefox, Edge) for the web app.
Internet connection to load external CDNs (Chart.js, Bootstrap).
Python 3.x installed for running expenses.py (with Matplotlib or Seaborn if used).


Setup:

Clone or download the repository to your local machine.
Ensure all files (index.html, script.js, styles.css, expenses.py, README.md) are in the same directory.


Run the Web Application:

Open index.html in your browser by double-clicking the file or using file:// protocol (e.g., file:///path/to/index.html).
No server is required as the application uses localStorage for data persistence.


Run the Python Script:

Open a terminal in the project directory.
Run python expenses.py to execute the script (ensure dependencies like Matplotlib are installed via pip install matplotlib or pip install seaborn if required).
The script may generate plots or require expense data input (e.g., from a file or hardcoded array).


Optional Development:

For a live web preview, use a local server (e.g., with Python: python -m http.server 8000) and access via http://localhost:8000.



Key Features Implemented

Expense Management: Add, edit, delete, and filter expenses by category and date range.
Data Visualization: Render pie, bar, line, doughnut, scatter, polar area, and box charts to analyze spending in the web app.
Data Persistence: Store expenses in localStorage for session continuity.
Export Functionality: Export expense data as a CSV file and individual charts as PNG images.
Theme Toggle: Switch between dark and light themes with dynamic chart updates.
Responsive Design: Fully responsive layout using Bootstrap for desktop and mobile.
Python Visualization: Alternative plotting of scatter, polar, and box charts using Python (via expenses.py).

Cursor Usage Documentation
3-5 Interesting Prompts Used with Cursor

"Create a JavaScript function to aggregate expenses by category from an array."
"Generate a Chart.js scatter plot configuration for expense data over time."
"Design a CSS gradient button style for a modern UI."
"Build a responsive HTML dashboard with multiple chart sections."
"Implement a Python script using Matplotlib to plot a box chart of expenses."

How Cursor Helped Solve Specific Challenges

Chart Rendering: Cursor provided initial Chart.js code, which I modified to include time scales for scatter plots and theme-aware options.
Data Processing: Cursor suggested reduce for data aggregation, optimizing computeCategoryData and computeMonthlyData.
Python Integration: Cursor generated a Matplotlib-based plot structure for expenses.py, which I adjusted to match the web app's data format.

Any Modifications You Made to AI-Generated Code and Why

Scatter Chart: Added new Date(exp.date) and time: { unit: 'day' } to handle dates correctly, as the AI version lacked time scale support.
Polar Chart: Included scales: { r: { beginAtZero: true } } to ensure proper scaling, fixing AI's incomplete options.
Box Chart: Simplified to a single dataset with means instead of multiple datasets to prevent rendering issues from AI's complex setup.
Edit Function: Replaced find with findIndex in editExpense for accurate array updates, addressing AI's scoping errors.
Python Script: Modified expenses.py to use a hardcoded expense list instead of file I/O, aligning with the web app's data structure.

Challenges Faced and How You Overcame Them

Chart Display Issues: Scatter, polar, and box charts didn’t render in the web app. Resolved by adding the Chart.js date-fns adapter, converting dates to Date objects, and simplifying box chart data.
Edit Functionality: Edits failed to update. Fixed by using findIndex for precise indexing and adding console logs for debugging.
Theme Inconsistency: Chart legends/axes didn’t adapt to theme changes. Overcame by using CSS variables in Chart.js options.
Date Validation: Future dates were accepted. Added validation against the current date in add/edit forms.
Python-Web Sync: expenses.py plots worked but didn’t match web data. Aligned data formats by adjusting the Python script to mirror script.js structures.

Bonus Feature Explanation

Dynamic Date Display: Included a "Last updated" timestamp on the webpage, updating to the current time (e.g., 02:07 PM IST, October 05, 2025) using JavaScript’s toLocaleString. This provides users with real-time data freshness awareness.

Time Spent on the Assignment

Planning and Research: 15 mins
Initial Development: 40 mins
Debugging and Fixes: 1 hour 10 mins
Documentation and Polish: 15 mins
Total: 2 hours 20 mins

User Input data
<img width="1383" height="909" alt="image" src="https://github.com/user-attachments/assets/a96e1c23-7da9-4233-a51b-191d8827879c" />
Filtering of data
<img width="1371" height="389" alt="image" src="https://github.com/user-attachments/assets/617ac697-71b4-4f41-a032-f263345e7d37" />
Data storage
<img width="1442" height="781" alt="image" src="https://github.com/user-attachments/assets/bf1fdd70-6fe1-4d0d-9c78-e9c0997dddf1" />
Editing/deleting of Data
<img width="1318" height="571" alt="image" src="https://github.com/user-attachments/assets/954da4cb-9b67-40ae-a1b8-271ef25dc58a" />
Statistics 
<img width="1342" height="392" alt="image" src="https://github.com/user-attachments/assets/504d2a6e-3eb7-4160-9d67-5a87b5e38484" />
Export to csv file
<img width="1249" height="763" alt="image" src="https://github.com/user-attachments/assets/d4a4bd2f-b530-4fbc-8894-fc4ba56180df" />
Charts (Downloadable)
<img width="1249" height="763" alt="image" src="https://github.com/user-attachments/assets/920219d8-62e9-48fa-8de3-c5e156fb8a90" />
<img width="1249" height="730" alt="image" src="https://github.com/user-attachments/assets/aade0eb2-d373-4a10-a424-b4c310cee96f" />
<img width="1241" height="738" alt="image" src="https://github.com/user-attachments/assets/5c4deb9e-25ce-4dd2-9f7f-d619da9818e7" />
<img width="1205" height="594" alt="image" src="https://github.com/user-attachments/assets/5f5b7637-5797-47a2-a297-d22645cb5004" />










