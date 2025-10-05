import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import sys
import os
import numpy as np
from datetime import datetime

# Enhanced script to generate multiple plots:
# - Bar: Spending by category
# - Pie: Spending distribution by category
# - Line: Monthly spending trend
# - Box: Distribution of expenses per category
# - Scatter: Individual expenses over time
# - Polar: Radial spending by category
# Features:
# - CLI arguments for filtering (category, date range) and customization
# - Export all plots in PNG or PDF
# - Comprehensive stats with additional metrics (e.g., min, std)
# - Robust error handling with improved path validation

def parse_date(date_str):
    try:
        return datetime.strptime(date_str, '%Y-%m-%d')
    except ValueError:
        print(f"Invalid date format: {date_str}. Use YYYY-MM-DD.")
        sys.exit(1)

# Get CSV path (arg or prompt)
if len(sys.argv) > 1:
    csv_path = sys.argv[1]
else:
    csv_path = input("Enter the path to the CSV file (default: expenses.csv): ") or 'expenses.csv'

# Normalize and validate path
csv_path = os.path.normpath(csv_path.strip())  # Normalize path and remove extra whitespace/quotes
csv_path = os.path.abspath(csv_path)  # Convert to absolute path

# Check if file exists and is a valid file
if not os.path.isfile(csv_path):
    print(f"Error: '{csv_path}' does not exist or is not a file. Please provide a valid CSV path.")
    sys.exit(1)

try:
    df = pd.read_csv(csv_path)
    df['Date'] = pd.to_datetime(df['Date'])  # Ensure date column is datetime
except FileNotFoundError:
    print(f"Error: '{csv_path}' not found. Please provide a valid path.")
    sys.exit(1)
except pd.errors.EmptyDataError:
    print("Error: The CSV file is empty.")
    sys.exit(1)
except KeyError:
    print("Error: CSV must have columns: ID, Date, Category, Amount, Description.")
    sys.exit(1)
except Exception as e:
    print(f"Error reading CSV file: {str(e)}")
    sys.exit(1)

# Parse CLI arguments
import argparse
parser = argparse.ArgumentParser(description="Analyze expenses from CSV and generate multiple plots.")
parser.add_argument('--category', type=str, help="Filter by category (case-insensitive)")
parser.add_argument('--from_date', type=str, help="Filter from date (YYYY-MM-DD)")
parser.add_argument('--to_date', type=str, help="Filter to date (YYYY-MM-DD)")
parser.add_argument('--plot_types', type=str, nargs='+', default=['bar', 'pie', 'line', 'box', 'scatter', 'polar'], 
                    choices=['bar', 'pie', 'line', 'box', 'scatter', 'polar'], help="Plot types to generate")
parser.add_argument('--export_format', type=str, default='png', choices=['png', 'pdf'], help="Export plot format")
parser.add_argument('--dpi', type=int, default=300, help="DPI for exported plots")
args = parser.parse_args(sys.argv[2:])

# Apply filters
filtered_df = df.copy()
if args.category:
    filtered_df = filtered_df[filtered_df['Category'].str.lower() == args.category.lower()]
if args.from_date:
    from_date = parse_date(args.from_date)
    filtered_df = filtered_df[filtered_df['Date'] >= from_date]
if args.to_date:
    to_date = parse_date(args.to_date)
    filtered_df = filtered_df[filtered_df['Date'] <= to_date]

if filtered_df.empty:
    print("No data after applying filters.")
    sys.exit(0)

# Comprehensive stats
total_spent = filtered_df['Amount'].sum()
transactions = len(filtered_df)
mean_amount = filtered_df['Amount'].mean()
median_amount = filtered_df['Amount'].median()
max_amount = filtered_df['Amount'].max()
min_amount = filtered_df['Amount'].min()
std_amount = filtered_df['Amount'].std()
by_category = filtered_df.groupby('Category')['Amount'].sum().sort_values(ascending=False)

print("Expense Analysis Summary:")
print(f"Total Spent: ${total_spent:.2f}")
print(f"Number of Transactions: {transactions}")
print(f"Average Expense: ${mean_amount:.2f}")
print(f"Median Expense: ${median_amount:.2f}")
print(f"Max Expense: ${max_amount:.2f}")
print(f"Min Expense: ${min_amount:.2f}")
print(f"Standard Deviation: ${std_amount:.2f}")
print("Spending by Category:")
print(by_category.to_string())

# Plotting setup
sns.set_style("darkgrid")
plt.rcParams.update({'font.size': 12})

# Generate multiple plots
for plot_type in args.plot_types:
    fig, ax = plt.subplots(figsize=(12, 7))

    if plot_type == 'bar':
        # Bar: Spending by category
        sns.barplot(x=by_category.index, y=by_category.values, ax=ax, palette='viridis')
        ax.set_title('Spending by Category (Bar Chart)', fontsize=16)
        ax.set_xlabel('Category', fontsize=12)
        ax.set_ylabel('Amount ($)', fontsize=12)
        plt.xticks(rotation=45, ha='right')

    elif plot_type == 'pie':
        # Pie: Spending distribution by category
        by_category.plot(kind='pie', ax=ax, autopct='%1.1f%%', colors=sns.color_palette('viridis', len(by_category)))
        ax.set_title('Spending by Category (Pie Chart)', fontsize=16)
        ax.set_ylabel('')

    elif plot_type == 'line':
        # Line: Monthly spending trend
        monthly = filtered_df.resample('ME', on='Date')['Amount'].sum()  # Updated to 'ME'
        sns.lineplot(x=monthly.index, y=monthly.values, ax=ax, marker='o', color='cyan')
        ax.set_title('Monthly Spending Trend (Line Chart)', fontsize=16)
        ax.set_xlabel('Date', fontsize=12)
        ax.set_ylabel('Amount ($)', fontsize=12)
        plt.xticks(rotation=45)

    elif plot_type == 'box':
        # Box: Expense distribution per category
        sns.boxplot(x='Amount', y='Category', data=filtered_df, hue='Category', palette='viridis', legend=False)  # Updated to use hue
        ax.set_title('Expense Distribution by Category (Box Plot)', fontsize=16)
        ax.set_xlabel('Amount ($)', fontsize=12)
        ax.set_ylabel('Category', fontsize=12)
        plt.xticks(rotation=45, ha='right')

    elif plot_type == 'scatter':
        # Scatter: Individual expenses over time
        sns.scatterplot(x='Date', y='Amount', data=filtered_df, ax=ax, color='cyan', s=100)
        ax.set_title('Expenses Over Time (Scatter Plot)', fontsize=16)
        ax.set_xlabel('Date', fontsize=12)
        ax.set_ylabel('Amount ($)', fontsize=12)
        plt.xticks(rotation=45)

    elif plot_type == 'polar':
        # Polar: Radial spending by category
        categories = by_category.index.tolist()
        values = by_category.values
        n = len(categories)
        angles = np.linspace(0, 2 * np.pi, n, endpoint=False)
        # Ensure values and angles match by avoiding extra repetition
        ax = fig.add_subplot(111, polar=True)
        ax.fill(angles, values, color='cyan', alpha=0.25)
        ax.plot(angles, values, color='cyan', linewidth=2)
        ax.set_xticks(angles)
        ax.set_xticklabels(categories, rotation_mode='anchor')
        ax.set_title('Spending by Category (Polar Area Chart)', fontsize=16, pad=20)
        ax.grid(True, linestyle='--', alpha=0.5)

    if plot_type != 'polar':
        ax.grid(True, linestyle='--', alpha=0.5)
    plt.tight_layout()

    # Export plot
    plot_path = f'spending_{plot_type}.{args.export_format}'
    plt.savefig(plot_path, dpi=args.dpi, bbox_inches='tight')
    print(f"{plot_type.capitalize()} plot exported to: {os.path.abspath(plot_path)}")
    plt.show()
    plt.close(fig)