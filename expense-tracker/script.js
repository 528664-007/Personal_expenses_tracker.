let expenses = loadExpenses();
let charts = {}; // Object to hold multiple charts

// Load expenses from localStorage
function loadExpenses() {
    const stored = localStorage.getItem('expenses');
    return stored ? JSON.parse(stored) : [];
}

// Save expenses to localStorage
function saveExpenses() {
    localStorage.setItem('expenses', JSON.stringify(expenses));
}

// Render expense list
function renderList(filteredExpenses = expenses) {
    const list = document.getElementById('expenseList');
    list.innerHTML = '';
    if (filteredExpenses.length === 0) {
        list.innerHTML = '<p class="text-muted">No expenses found.</p>';
        return;
    }
    filteredExpenses.forEach(exp => {
        const div = document.createElement('div');
        div.className = 'expense-item';
        div.innerHTML = `
            <p><strong>Date:</strong> ${exp.date}</p>
            <p><strong>Category:</strong> ${exp.category}</p>
            <p><strong>Amount:</strong> $${exp.amount.toFixed(2)}</p>
            <p><strong>Description:</strong> ${exp.description || 'N/A'}</p>
            <button class="btn btn-sm neon-btn edit-btn" onclick="editExpense(${exp.id})" style="background: linear-gradient(45deg, #4d4dff, #8080ff); margin-right: 5px;">Edit</button>
            <button class="btn btn-sm neon-btn" onclick="deleteExpense(${exp.id})" style="background: linear-gradient(45deg, #ff4d4d, #ff8080);">Delete</button>
        `;
        list.appendChild(div);
    });
}

// Compute data for charts
function computeCategoryData(filteredExpenses) {
    const byCategory = filteredExpenses.reduce((acc, exp) => {
        acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
        return acc;
    }, {});
    console.log('Category Data:', { labels: Object.keys(byCategory), values: Object.values(byCategory) });
    return {
        labels: Object.keys(byCategory),
        values: Object.values(byCategory)
    };
}

function computeMonthlyData(filteredExpenses) {
    const byMonth = filteredExpenses.reduce((acc, exp) => {
        const month = exp.date.slice(0, 7); // YYYY-MM
        acc[month] = (acc[month] || 0) + exp.amount;
        return acc;
    }, {});
    const sortedMonths = Object.keys(byMonth).sort();
    console.log('Monthly Data:', { labels: sortedMonths, values: sortedMonths.map(month => byMonth[month]) });
    return {
        labels: sortedMonths,
        values: sortedMonths.map(month => byMonth[month])
    };
}

function computeScatterData(filteredExpenses) {
    const data = filteredExpenses.map(exp => ({
        x: new Date(exp.date), // Convert to Date object for time scale
        y: exp.amount
    }));
    console.log('Scatter Data:', data);
    return data;
}

function computeBoxData(filteredExpenses) {
    const byCategory = filteredExpenses.reduce((acc, exp) => {
        if (!acc[exp.category]) acc[exp.category] = [];
        acc[exp.category].push(exp.amount);
        return acc;
    }, {});
    const labels = Object.keys(byCategory);
    const datasets = [{
        label: 'Expense Distribution',
        data: labels.map(category => {
            const amounts = byCategory[category];
            return amounts.length > 0 ? amounts.reduce((sum, val) => sum + val, 0) / amounts.length : 0; // Mean per category
        }),
        backgroundColor: 'rgba(0, 255, 204, 0.5)',
        borderColor: '#00ffcc',
        borderWidth: 1
    }];
    console.log('Box Data (Mean per Category):', { labels, datasets });
    return { labels, datasets };
}

// Compute comprehensive stats
function computeComprehensiveStats(filteredExpenses) {
    if (filteredExpenses.length === 0) return null;
    const amounts = filteredExpenses.map(exp => exp.amount);
    const totalSpent = amounts.reduce((sum, val) => sum + val, 0);
    const transactions = amounts.length;
    const meanAmount = totalSpent / transactions;
    const sortedAmounts = [...amounts].sort((a, b) => a - b);
    const medianAmount = transactions % 2 === 0 
        ? (sortedAmounts[transactions / 2 - 1] + sortedAmounts[transactions / 2]) / 2
        : sortedAmounts[Math.floor(transactions / 2)];
    const maxAmount = Math.max(...amounts);
    const minAmount = Math.min(...amounts);
    const stdAmount = Math.sqrt(amounts.reduce((sum, val) => sum + Math.pow(val - meanAmount, 2), 0) / transactions);
    const byCategory = filteredExpenses.reduce((acc, exp) => {
        acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
        return acc;
    }, {});
    const sortedByCategory = Object.entries(byCategory).sort((a, b) => b[1] - a[1]);
    console.log('Comprehensive Stats:', { totalSpent, transactions, meanAmount, medianAmount, maxAmount, minAmount, stdAmount, byCategory: sortedByCategory });
    return {
        totalSpent,
        transactions,
        meanAmount,
        medianAmount,
        maxAmount,
        minAmount,
        stdAmount,
        byCategory: sortedByCategory
    };
}

// Render comprehensive stats
function renderStatsText(filteredExpenses = expenses) {
    const stats = document.getElementById('comprehensiveStats');
    stats.innerHTML = '';
    const statsData = computeComprehensiveStats(filteredExpenses);
    if (!statsData) {
        stats.innerHTML = '<p class="text-muted">No data for statistics.</p>';
        Object.keys(charts).forEach(destroyChart);
        return;
    }

    const { totalSpent, transactions, meanAmount, medianAmount, maxAmount, minAmount, stdAmount, byCategory } = statsData;
    let html = `
        <div class="stats-item">
            <p><strong>Total Spent:</strong> $${totalSpent.toFixed(2)}</p>
            <p><strong>Number of Transactions:</strong> ${transactions}</p>
            <p><strong>Average Expense:</strong> $${meanAmount.toFixed(2)}</p>
            <p><strong>Median Expense:</strong> $${medianAmount.toFixed(2)}</p>
        </div>
        <div class="stats-item">
            <p><strong>Max Expense:</strong> $${maxAmount.toFixed(2)}</p>
            <p><strong>Min Expense:</strong> $${minAmount.toFixed(2)}</p>
            <p><strong>Standard Deviation:</strong> $${stdAmount.toFixed(2)}</p>
        </div>
        <div class="stats-item">
            <p><strong>Spending by Category:</strong></p>
            <ul>
                ${byCategory.map(([cat, amt]) => `<li>${cat}: $${amt.toFixed(2)}</li>`).join('')}
            </ul>
        </div>
    `;
    stats.innerHTML = html;
}

// Render all charts in subplots
function renderCharts(filteredExpenses = expenses) {
    console.log('Rendering charts with filteredExpenses:', filteredExpenses);
    if (filteredExpenses.length === 0) {
        console.log('No expenses to render charts.');
        Object.keys(charts).forEach(destroyChart);
        return;
    }

    const categoryData = computeCategoryData(filteredExpenses);
    const monthlyData = computeMonthlyData(filteredExpenses);
    const scatterData = computeScatterData(filteredExpenses);
    const boxData = computeBoxData(filteredExpenses);

    // Verify canvas elements exist
    const canvasIds = ['pieChart', 'barChart', 'lineChart', 'doughnutChart', 'scatterChart', 'polarChart', 'boxChart'];
    canvasIds.forEach(id => {
        const canvas = document.getElementById(id);
        if (!canvas) console.error(`Canvas element with ID ${id} not found.`);
    });

    // Pie Chart
    destroyChart('pieChart');
    if (categoryData.labels.length && categoryData.values.length) {
        charts.pieChart = new Chart(document.getElementById('pieChart').getContext('2d'), {
            type: 'pie',
            data: {
                labels: categoryData.labels,
                datasets: [{
                    data: categoryData.values,
                    backgroundColor: ['#00ffcc', '#ff00cc', '#00ccff', '#cc00ff', '#ffcc00', '#ccff00'],
                    borderColor: 'var(--bg-color)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: { legend: { position: 'top', labels: { color: 'var(--text-color)' } } }
            }
        });
        console.log('Pie Chart created.');
    } else {
        console.warn('No data for Pie Chart.');
    }

    // Bar Chart
    destroyChart('barChart');
    if (categoryData.labels.length && categoryData.values.length) {
        charts.barChart = new Chart(document.getElementById('barChart').getContext('2d'), {
            type: 'bar',
            data: {
                labels: categoryData.labels,
                datasets: [{
                    label: 'Spending by Category',
                    data: categoryData.values,
                    backgroundColor: '#00ffcc'
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: { beginAtZero: true, title: { display: true, text: 'Amount ($)', color: 'var(--text-color)' } },
                    x: { title: { display: true, text: 'Category', color: 'var(--text-color)' } }
                }
            }
        });
        console.log('Bar Chart created.');
    } else {
        console.warn('No data for Bar Chart.');
    }

    // Line Chart
    destroyChart('lineChart');
    if (monthlyData.labels.length && monthlyData.values.length) {
        charts.lineChart = new Chart(document.getElementById('lineChart').getContext('2d'), {
            type: 'line',
            data: {
                labels: monthlyData.labels,
                datasets: [{
                    label: 'Monthly Spending',
                    data: monthlyData.values,
                    borderColor: '#ff00cc',
                    backgroundColor: 'rgba(255, 0, 204, 0.2)',
                    fill: true
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: { beginAtZero: true, title: { display: true, text: 'Amount ($)', color: 'var(--text-color)' } },
                    x: { title: { display: true, text: 'Month', color: 'var(--text-color)' } }
                }
            }
        });
        console.log('Line Chart created.');
    } else {
        console.warn('No data for Line Chart.');
    }

    // Doughnut Chart
    destroyChart('doughnutChart');
    if (categoryData.labels.length && categoryData.values.length) {
        charts.doughnutChart = new Chart(document.getElementById('doughnutChart').getContext('2d'), {
            type: 'doughnut',
            data: {
                labels: categoryData.labels,
                datasets: [{
                    data: categoryData.values,
                    backgroundColor: ['#00ffcc', '#ff00cc', '#00ccff', '#cc00ff', '#ffcc00', '#ccff00'],
                    borderColor: 'var(--bg-color)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: { legend: { position: 'top', labels: { color: 'var(--text-color)' } } }
            }
        });
        console.log('Doughnut Chart created.');
    } else {
        console.warn('No data for Doughnut Chart.');
    }

    // Scatter Plot
    destroyChart('scatterChart');
    if (scatterData.length) {
        charts.scatterChart = new Chart(document.getElementById('scatterChart').getContext('2d'), {
            type: 'scatter',
            data: {
                datasets: [{
                    label: 'Expenses Over Time',
                    data: scatterData,
                    backgroundColor: '#00ccff',
                    pointRadius: 5
                }]
            },
            options: {
                responsive: true,
                scales: {
                    x: { type: 'time', time: { unit: 'day' }, title: { display: true, text: 'Date', color: 'var(--text-color)' } },
                    y: { beginAtZero: true, title: { display: true, text: 'Amount ($)', color: 'var(--text-color)' } }
                },
                plugins: { legend: { labels: { color: 'var(--text-color)' } } }
            }
        });
        console.log('Scatter Chart created with data:', scatterData);
    } else {
        console.warn('No data for Scatter Chart.');
    }

    // Polar Area Chart
    destroyChart('polarChart');
    if (categoryData.labels.length && categoryData.values.length) {
        charts.polarChart = new Chart(document.getElementById('polarChart').getContext('2d'), {
            type: 'polarArea',
            data: {
                labels: categoryData.labels,
                datasets: [{
                    data: categoryData.values,
                    backgroundColor: ['#00ffcc', '#ff00cc', '#00ccff', '#cc00ff', '#ffcc00', '#ccff00']
                }]
            },
            options: {
                responsive: true,
                plugins: { legend: { position: 'top', labels: { color: 'var(--text-color)' } } },
                scales: { r: { beginAtZero: true, ticks: { color: 'var(--text-color)' } } }
            }
        });
        console.log('Polar Chart created.');
    } else {
        console.warn('No data for Polar Chart.');
    }

    // Box Plot (using bar chart approximation with mean)
    destroyChart('boxChart');
    if (boxData.labels.length && boxData.datasets.length) {
        charts.boxChart = new Chart(document.getElementById('boxChart').getContext('2d'), {
            type: 'bar',
            data: {
                labels: boxData.labels,
                datasets: boxData.datasets
            },
            options: {
                responsive: true,
                indexAxis: 'y', // Horizontal bars
                scales: {
                    x: { title: { display: true, text: 'Average Amount ($)', color: 'var(--text-color)' } },
                    y: { title: { display: true, text: 'Category', color: 'var(--text-color)' } }
                },
                plugins: {
                    legend: { display: false },
                    tooltip: { callbacks: { label: ctx => `${ctx.dataset.label}: $${ctx.raw.toFixed(2)}` } }
                }
            }
        });
        console.log('Box Chart created with data:', boxData);
    } else {
        console.warn('No data for Box Chart.');
    }
}

function destroyChart(id) {
    if (charts[id]) {
        charts[id].destroy();
        charts[id] = null;
        console.log(`Destroyed chart: ${id}`);
    }
}

// Combined render stats
function renderStats(filteredExpenses = expenses) {
    renderStatsText(filteredExpenses);
    renderCharts(filteredExpenses);
}

// Add expense
document.getElementById('expenseForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const amountInput = document.getElementById('amount');
    const amount = parseFloat(amountInput.value);
    const category = document.getElementById('category').value.trim();
    const date = document.getElementById('date').value;
    const description = document.getElementById('description').value;

    if (isNaN(amount) || amount <= 0) {
        alert('Amount must be a positive number greater than 0.');
        amountInput.focus();
        return;
    }
    if (!category) {
        alert('Please enter a category.');
        document.getElementById('category').focus();
        return;
    }
    if (!date) {
        alert('Please select a date.');
        document.getElementById('date').focus();
        return;
    }
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    const selectedDate = new Date(date);
    if (selectedDate > currentDate) {
        alert('Date cannot be in the future.');
        document.getElementById('date').focus();
        return;
    }

    const id = Date.now();
    expenses.push({ id, amount, category, date, description });
    saveExpenses();
    renderList();
    renderStats();
    e.target.reset();
    amountInput.focus();
});

// Delete expense
function deleteExpense(id) {
    if (confirm('Are you sure you want to delete this expense?')) {
        expenses = expenses.filter(exp => exp.id !== id);
        saveExpenses();
        renderList();
        renderStats();
    }
}

// Apply filter
document.getElementById('applyFilter').addEventListener('click', () => {
    const category = document.getElementById('filterCategory').value.trim();
    const from = document.getElementById('filterDateFrom').value;
    const to = document.getElementById('filterDateTo').value;

    if (from && to && new Date(from) > new Date(to)) {
        alert('From date cannot be after To date.');
        return;
    }

    let filtered = expenses;
    if (category) {
        filtered = filtered.filter(exp => exp.category.toLowerCase() === category.toLowerCase());
    }
    if (from) {
        const fromDate = new Date(from);
        fromDate.setHours(0, 0, 0, 0);
        filtered = filtered.filter(exp => new Date(exp.date) >= fromDate);
    }
    if (to) {
        const toDate = new Date(to);
        toDate.setHours(23, 59, 59, 999);
        filtered = filtered.filter(exp => new Date(exp.date) <= toDate);
    }

    renderList(filtered);
    renderStats(filtered);
});

// Clear filter
document.getElementById('clearFilter').addEventListener('click', () => {
    document.getElementById('filterCategory').value = '';
    document.getElementById('filterDateFrom').value = '';
    document.getElementById('filterDateTo').value = '';
    renderList();
    renderStats();
});

// Export to CSV
document.getElementById('exportCsv').addEventListener('click', () => {
    if (expenses.length === 0) {
        alert('No expenses to export.');
        return;
    }
    const csvContent = 'data:text/csv;charset=utf-8,' 
        + 'ID,Date,Category,Amount,Description\n'
        + expenses.map(exp => `${exp.id},${exp.date},${exp.category},${exp.amount},${exp.description ? `"${exp.description.replace(/"/g, '""')}"` : ''}`).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'expenses.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});

// Export individual charts
document.querySelectorAll('.export-chart').forEach(button => {
    button.addEventListener('click', () => {
        const chartId = button.dataset.chart;
        const canvas = document.getElementById(chartId);
        if (!charts[chartId]) {
            alert('No chart to export.');
            return;
        }
        const link = document.createElement('a');
        link.download = `${chartId}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    });
});

// Theme toggle
document.getElementById('themeToggle').addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
    const toggleBtn = document.getElementById('themeToggle');
    toggleBtn.textContent = document.body.classList.contains('light-theme') ? '🌙' : '☀️';
    renderStats(); // Re-render to update colors
});

// Initial render
renderList();
renderStats();

// Handle page unload to ensure persistence
window.addEventListener('beforeunload', saveExpenses);

// Edit expense
window.editExpense = function(id) {
    console.log('Attempting to edit expense with ID:', id);
    const expenseIndex = expenses.findIndex(exp => exp.id === id);
    if (expenseIndex === -1) {
        console.error('No expense found with ID:', id);
        return;
    }
    const expense = expenses[expenseIndex];

    const newAmount = prompt('Enter new amount:', expense.amount);
    if (newAmount === null) return;
    const amount = parseFloat(newAmount);
    if (isNaN(amount) || amount <= 0) {
        alert('Amount must be a positive number.');
        return;
    }

    const newCategory = prompt('Enter new category:', expense.category);
    if (newCategory === null) return;
    const category = newCategory.trim();
    if (!category) {
        alert('Category cannot be empty.');
        return;
    }

    const newDate = prompt('Enter new date (YYYY-MM-DD):', expense.date);
    if (newDate === null) return;
    const date = newDate;
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    const selectedDate = new Date(date);
    if (isNaN(selectedDate.getTime()) || selectedDate > currentDate) {
        alert('Invalid or future date.');
        return;
    }

    const newDescription = prompt('Enter new description:', expense.description || '');
    if (newDescription === null) return;
    const description = newDescription.trim();

    expenses[expenseIndex] = { id, amount, category, date, description };
    console.log('Expense updated to:', expenses[expenseIndex]);
    saveExpenses();
    renderList();
    renderStats();
};