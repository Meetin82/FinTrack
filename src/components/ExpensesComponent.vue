<template>
  <div class="container mt-4">
    <h2>Внесение трат</h2>
    <form @submit.prevent="addExpense">
      <div class="mb-3">
        <label for="category" class="form-label">Категория <span class="text-danger">*</span></label>
        <input
            type="text"
            id="category"
            v-model="newExpense.category"
            class="form-control"
        />
      </div>
      <div class="mb-3">
        <label for="amount" class="form-label" >Сумма <span class="text-danger">*</span></label>
        <input
            type="number"
            id="amount"
            v-model="newExpense.amount"
            class="form-control"
        />
      </div>
      <div class="mb-3">
        <label for="paymentType" class="form-label">Тип оплаты</label>
        <select
            id="paymentType"
            v-model="newExpense.paymentType"
            class="form-select"
        >
          <option>Наличные</option>
          <option>Карта</option>
          <option>Онлайн</option>
        </select>
      </div>
      <div class="mb-3">
        <label for="comment" class="form-label">Комментарий</label>
        <textarea
            id="comment"
            v-model="newExpense.comment"
            class="form-control"
        ></textarea>
      </div>
      <div class="mb-3">
        <div class="form-check">
          <input
              type="checkbox"
              id="customDate"
              v-model="useCustomDate"
              class="form-check-input"
          />
          <label for="customDate" class="form-check-label">Указать дату и время вручную</label>
        </div>
        <div v-if="useCustomDate" class="mt-2">
          <label for="date" class="form-label">Дата и время</label>
          <input
              type="datetime-local"
              id="date"
              v-model="newExpense.date"
              class="form-control"
          />
        </div>
      </div>
      <button type="submit" class="btn btn-primary">Добавить трату</button>
    </form>

    <hr />

    <h3>История трат</h3>
    <div v-for="(expenses, date) in groupedExpenses" :key="date" class="mb-4">
      <h4>{{ date }}</h4>
      <ul class="list-group">
        <li
            class="list-group-item d-flex justify-content-between align-items-center"
            v-for="(expense, index) in expenses"
            :key="index"
        >
          <div>
            <strong>{{ expense.category }}</strong> - {{ expense.amount }} ₽
            <br />
            <small>
              {{ expense.paymentType }} | {{ expense.comment }}<br />
              {{ new Date(expense.date).toLocaleTimeString('ru-RU', {
              hour: '2-digit',
              minute: '2-digit',
            }) }}
            </small>
          </div>
          <button class="btn btn-danger btn-sm" @click="removeExpense(index)">
            Удалить
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>


<script>

import toastr from "toastr";
import "toastr/build/toastr.min.css";

export default {
  name: 'ExpensesComponent',

  data() {
    return {
      newExpense: {
        category: '',
        amount: 0,
        paymentType: 'Наличные',
        comment: '',
        date: new Date().toISOString(),
      },
      useCustomDate: false,
      expenses: [],
    };
  },

  computed: {
    groupedExpenses() {
      const grouped = {};
      const sortedExpenses = [...this.expenses].sort((a, b) => new Date(a.date) - new Date(b.date));

      sortedExpenses.forEach((expense) => {
        const date = new Date(expense.date).toLocaleDateString('ru-RU', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
        if (!grouped[date]) {
          grouped[date] = [];
        }
        grouped[date].push(expense);
      });

      return grouped;
    },
  },

  methods: {
    addExpense() {
      if (!this.newExpense.category) {
        toastr.error("Пожалуйста, заполните все обязательные поля.", "Ошибка");
        return;
      }

      if (this.newExpense.amount <= 0) {
        toastr.error("Пожалуйста, введите корректную сумму траты.", "Ошибка");
        return;
      }

      if (!this.useCustomDate) {
        this.newExpense.date = new Date().toISOString();
      }

      this.expenses.push({...this.newExpense});
      localStorage.setItem('expenses', JSON.stringify(this.expenses));

      this.newExpense = {
        category: '',
        amount: 0,
        paymentType: 'Наличные',
        comment: '',
        date: new Date().toISOString(),
      };
      this.useCustomDate = false;
    },

    removeExpense(index) {
      this.expenses.splice(index, 1);
      localStorage.setItem('expenses', JSON.stringify(this.expenses));
    },
  },

  created() {
    const savedExpenses = localStorage.getItem('expenses');
    if (savedExpenses) {
      this.expenses = JSON.parse(savedExpenses);
    }
  },
};
</script>
