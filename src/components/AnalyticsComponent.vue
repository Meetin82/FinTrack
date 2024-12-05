<template>
  <div class="container mt-4">
    <h2>Аналитика</h2>
    <canvas id="expensesChart" style="width: 10%; height: 10px;"></canvas>
  </div>
</template>

<script>
import { Chart, ArcElement, CategoryScale, Tooltip, Legend, Title, PieController } from 'chart.js';

// Регистрация всех нужных компонентов для работы с Pie диаграммой
Chart.register(ArcElement, CategoryScale, Tooltip, Legend, Title, PieController);

export default {
  name: 'AnalyticsComponent',
  data() {
    return {
      chart: null,
      categories: [],
      categoryTotals: [],
    };
  },
  methods: {
    loadChartData() {
      const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
      const totals = {};

      expenses.forEach((expense) => {
        if (!totals[expense.category]) {
          totals[expense.category] = 0;
        }
        totals[expense.category] += +expense.amount;
      });

      this.categories = Object.keys(totals);
      this.categoryTotals = Object.values(totals);
    },
    renderChart() {
      const ctx = document.getElementById('expensesChart').getContext('2d');
      this.chart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: this.categories,
          datasets: [
            {
              data: this.categoryTotals,
              backgroundColor: [
                '#FF6384',
                '#36A2EB',
                '#FFCE56',
                '#4BC0C0',
                '#9966FF',
                '#FF9F40',
              ],
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
          },
        },
      });
    },
  },
  mounted() {
    this.loadChartData();
    this.renderChart();
  },
};
</script>
