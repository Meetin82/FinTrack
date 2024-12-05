<template>
  <div class="container mt-4">
    <h2>Аналитика</h2>
    <div class="row">
      <!-- Первый график: Расходы по категориям (Pie) -->
      <div class="col-md-6">
        <h5 class="text-center">Расходы по категориям</h5>
        <canvas id="expensesChart"></canvas>
      </div>
      <!-- Второй график: Расходы по дням (Line) -->
      <div class="col-md-6">
        <h5 class="text-center">Ежедневные расходы</h5>
        <canvas id="dailyExpensesChart"></canvas>
      </div>
    </div>
    <div class="row mt-4">
      <!-- Третий график: Доходы, расходы, сбережения (Bar) -->
      <div class="col-md-6">
        <h5 class="text-center">Доходы, расходы, сбережения</h5>
        <canvas id="incomeVsExpensesChart"></canvas>
      </div>

      <!-- Четвертый график: Соотношения долгов по именам -->
      <div class="col-md-6">
        <h5 class="text-center">Соотношение долгов</h5>
        <canvas id="debtsChart"></canvas>
      </div>
    </div>
  </div>
</template>

<script>
import {
  Chart,
  ArcElement,
  LineElement,
  BarElement,
  PointElement, // Регистрация PointElement
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title,
  PieController,
  DoughnutController,
  BarController,
  LineController,
} from "chart.js";

// Регистрация всех компонентов
Chart.register(
    ArcElement,
    LineElement,
    BarElement,
    PointElement, // Необходимо зарегистрировать
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
    Title,
    PieController,
    DoughnutController,
    BarController,
    LineController
);


export default {
  name: "AnalyticsComponent",
  data() {
    return {
      charts: {}, // Для хранения ссылок на все графики
      categories: [],
      categoryTotals: [],
      dailyExpenses: [],
      dates: [],
      debts: [], // Для хранения долгов из localStorage
      debtors: [], // Имена должников
      debtAmounts: [], // Суммы долгов
      summaryData: {
        income: 0,
        expenses: 0,
        savings: 0,
      },
    };
  },
  methods: {
    loadChartData() {
      const expenses = JSON.parse(localStorage.getItem("expenses")) || [];
      const settings = JSON.parse(localStorage.getItem("settings")) || {
        income: 0,
        savingsPercentage: 0,
        fixedExpenses: 0
      };

      // Расходы по категориям
      const totals = {};
      const dailyTotals = {};
      expenses.forEach((expense) => {
        if (!totals[expense.category]) totals[expense.category] = 0;
        totals[expense.category] += +expense.amount;

        const date = expense.date || "Без даты";
        if (!dailyTotals[date]) dailyTotals[date] = 0;
        dailyTotals[date] += +expense.amount;
      });

      this.categories = Object.keys(totals);
      this.categoryTotals = Object.values(totals);

      // Данные для ежедневных расходов
      this.dates = Object.keys(dailyTotals)
          .sort((a, b) => new Date(a) - new Date(b)) // Сортировка по датам
          .map((date) => {
            const parsedDate = new Date(date);
            if (!isNaN(parsedDate)) {
              // Преобразование ISO-строки в человекочитаемый формат
              return parsedDate.toLocaleDateString("ru-RU", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              });
            }
            return date; // Если дата некорректна, оставить как есть
          });

      this.dailyExpenses = Object.keys(dailyTotals)
          .sort((a, b) => new Date(a) - new Date(b)) // Тот же порядок, что и у this.dates
          .map((date) => dailyTotals[date]);


      // Сводные данные
      this.summaryData.income = settings.income;
      this.summaryData.expenses = this.categoryTotals.reduce((sum, val) => sum + val, 0);
      this.summaryData.savings = (settings.income * settings.savingsPercentage) / 100;

      const savedDebts = JSON.parse(localStorage.getItem("debts")) || [];

      // Обработка данных долгов
      const debtTotals = {};
      savedDebts.forEach((debt) => {
        if (!debtTotals[debt.debtor]) debtTotals[debt.debtor] = 0;
        debtTotals[debt.debtor] += +debt.amount;
      });

      this.debtors = Object.keys(debtTotals);
      this.debtAmounts = Object.values(debtTotals);

    },
    renderCharts() {
      // Расходы по категориям (Pie)
      const ctxPie = document.getElementById("expensesChart").getContext("2d");
      this.charts.expensesChart = new Chart(ctxPie, {
        type: "pie",
        data: {
          labels: this.categories,
          datasets: [
            {
              data: this.categoryTotals,
              backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40"],
            },
          ],
        },
        options: {responsive: true, plugins: {legend: {position: "top"}}},
      });

      // Ежедневные расходы (Line)
      const ctxLine = document.getElementById("dailyExpensesChart").getContext("2d");
      this.charts.dailyExpensesChart = new Chart(ctxLine, {
        type: "line",
        data: {
          labels: this.dates,
          datasets: [
            {
              label: "Ежедневные расходы",
              data: this.dailyExpenses,
              borderColor: "#36A2EB",
              tension: 0.2,
            },
          ],
        },
        options: {responsive: true, plugins: {legend: {position: "top"}}},
      });

      // Доходы, расходы, сбережения (Bar)
      const ctxBar = document.getElementById("incomeVsExpensesChart").getContext("2d");
      this.charts.incomeVsExpensesChart = new Chart(ctxBar, {
        type: "bar",
        data: {
          labels: ["Доход", "Расходы", "Сбережения"],
          datasets: [
            {
              label: "Сумма",
              data: [this.summaryData.income, this.summaryData.expenses, this.summaryData.savings],
              backgroundColor: ["#36A2EB", "#FF6384", "#FFCE56"],
            },
          ],
        },
        options: {responsive: true, plugins: {legend: {position: "top"}}},
      });

      // График долгов (Bar Horizontal)
      const ctxDebts = document.getElementById("debtsChart").getContext("2d");
      this.charts.debtsChart = new Chart(ctxDebts, {
        type: "bar",
        data: {
          labels: this.debtors,
          datasets: [
            {
              label: "Сумма долгов",
              data: this.debtAmounts,
              backgroundColor: "#FF9F40",
            },
          ],
        },
        options: {
          indexAxis: "y", // Горизонтальная ориентация
          responsive: true,
          plugins: {
            legend: {
              position: "top",
            },
          },
          scales: {
            x: {
              beginAtZero: true,
            },
          },
        },
      });
    },
  },
  mounted() {
    this.loadChartData();
    this.renderCharts();
  },
};
</script>
