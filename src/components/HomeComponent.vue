<template>
  <div class="container mt-4">
    <h2 class="text-center">Финансовый трекер</h2>

    <!-- Текущая дата -->
    <section class="mb-4 text-center">
      <h4>{{ currentDate }}</h4>
    </section>

    <!-- Кнопка подсказки -->
    <div class="text-end mb-4">
      <button class="btn btn-primary" @click="showHelp = true">
        Как пользоваться?
      </button>
    </div>

    <!-- Главный контент -->
    <div class="row gy-4">
      <!-- Настройки -->
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Настройки</h3>
          </div>
          <div class="card-body">
            <form @submit.prevent="saveSettings">
              <div class="mb-3">
                <label for="income" class="form-label">Доход <span class="text-danger">*</span></label>
                <input
                    type="number"
                    id="income"
                    v-model="settings.income"
                    class="form-control"
                />
              </div>
              <div class="mb-3">
                <label for="savings" class="form-label">Сбережения (%)</label>
                <input
                    type="number"
                    id="savings"
                    v-model="settings.savingsPercentage"
                    class="form-control"
                />
              </div>
              <div class="mb-3">
                <label for="expenses" class="form-label">Обязательные траты</label>
                <input
                    type="number"
                    id="expenses"
                    v-model="settings.fixedExpenses"
                    class="form-control"
                />
              </div>
              <div class="mb-3">
                <label for="startDate" class="form-label">Дата начала расчёта <span class="text-danger">*</span></label>
                <input
                    type="date"
                    id="startDate"
                    v-model="settings.startDate"
                    class="form-control"
                />
              </div>
              <div class="mb-3">
                <label for="endDate" class="form-label">Дата конца расчёта <span class="text-danger">*</span></label>
                <input
                    type="date"
                    id="endDate"
                    v-model="settings.endDate"
                    class="form-control"
                />
              </div>
              <button type="submit" class="btn btn btn-primary w-100">Сохранить</button>
            </form>
          </div>
        </div>
      </div>

      <!-- Результаты -->
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Результаты</h3>
          </div>
          <div class="card-body">
            <div class="mb-3">
              <h4>Дневной лимит (без учёта трат):</h4>
              <p v-if="dailyLimitWithoutExpenses !== null">
                {{ dailyLimitWithoutExpenses.toFixed(2) }} ₽
              </p>
            </div>
            <div class="mb-3">
              <h4>Дневной лимит (с учётом трат):</h4>
              <p v-if="dailyLimitWithExpenses !== null">
                {{ dailyLimitWithExpenses.toFixed(2) }} ₽
              </p>
            </div>
            <div class="mb-3">
              <h4>Остаток:</h4>
              <p v-if="remainingAmount !== null">
                {{ remainingAmount.toFixed(2) }} ₽
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Модальное окно подсказки -->
    <HelpModal :showHelp="showHelp" @closeModal="showHelp = false"/>
  </div>
</template>

<script>

import toastr from "toastr";
import "toastr/build/toastr.min.css";
import HelpModal from '@/components/HelpModal.vue'; // Импортируем компонент


export default {
  name: "HomeComponent",

  components: {
    HelpModal
  },

  data() {
    return {
      settings: {
        income: 0,
        savingsPercentage: 0,
        fixedExpenses: 0,
        startDate: "",
        endDate: "",
      },
      dailyLimitWithoutExpenses: null,
      dailyLimitWithExpenses: null,
      remainingAmount: null,
      showHelp: false, // Управление модальным окном
      expenses: [],
      currentDate: new Date().toLocaleDateString("ru-RU", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    };
  },
  methods: {
    calculateLimitWithoutExpenses() {
      const totalDays = this.calculateDaysBetween(
          new Date(this.settings.startDate),
          new Date(this.settings.endDate)
      );
      const savings = (this.settings.income * this.settings.savingsPercentage) / 100;
      const availableAmount = this.settings.income - this.settings.fixedExpenses - savings;
      this.dailyLimitWithoutExpenses = totalDays > 0 ? availableAmount / totalDays : 0;
    },

    calculateLimitWithExpenses() {
      const totalSpent = this.expenses.reduce((sum, expense) => sum + parseFloat(expense.amount || 0), 0);
      const remainingDays = this.calculateDaysBetween(new Date(), new Date(this.settings.endDate));
      const savings = (this.settings.income * this.settings.savingsPercentage) / 100;
      const availableAmount = this.settings.income - this.settings.fixedExpenses - totalSpent - savings;
      this.dailyLimitWithExpenses = remainingDays > 0 ? availableAmount / remainingDays : 0;
      this.remainingAmount = availableAmount;
    },

    calculateDaysBetween(startDate, endDate) {
      return Math.max(
          Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)),
          1
      );
    },

    saveSettings() {
      if (!this.settings.income || !this.settings.startDate || !this.settings.endDate) {
        toastr.error("Пожалуйста, заполните все обязательные поля.", "Ошибка");
        return;
      }
      // Сохранение настроек
      localStorage.setItem("settings", JSON.stringify(this.settings));
      this.calculateLimitWithoutExpenses();
      this.calculateLimitWithExpenses();
      toastr.success("Настройки сохранены и расчёты обновлены!", "Успех");
    },
  },
  watch: {
    expenses: {
      handler: "calculateLimitWithExpenses",
      deep: true,
    },
  },
  created() {
    const savedExpenses = localStorage.getItem("expenses");
    if (savedExpenses) {
      this.expenses = JSON.parse(savedExpenses);
    }
    const savedSettings = localStorage.getItem("settings");
    if (savedSettings) {
      this.settings = JSON.parse(savedSettings);
    }
    this.calculateLimitWithoutExpenses();
    this.calculateLimitWithExpenses();
  },
};
</script>
