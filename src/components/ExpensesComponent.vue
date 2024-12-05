<template>
  <div class="container mt-4">
    <div class="row">
      <!-- Форма добавления -->
      <div class="col-md-6">
        <h2 class="text-primary">Внесение трат</h2>
        <form @submit.prevent="addExpense" class="p-3 border rounded shadow-sm">
          <div class="mb-3">
            <label for="category" class="form-label">Категория <span class="text-danger">*</span></label>
            <input
                type="text"
                id="category"
                v-model="newExpense.category"
                :class="{'form-control': true, 'is-invalid': isFieldInvalid('category')}"
                @input="validateCategory(); touchedFields.category = true;"
            />
            <div v-if="isFieldInvalid('category')" class="invalid-feedback">Это поле обязательно для заполнения.</div>
          </div>
          <div class="mb-3">
            <label for="amount" class="form-label">Сумма <span class="text-danger">*</span></label>
            <input
                type="number"
                id="amount"
                v-model="newExpense.amount"
                :class="{'form-control': true, 'is-invalid': isFieldInvalid('amount')}"
                @input="validateAmount(); touchedFields.amount = true;"
            />
            <div v-if="isFieldInvalid('amount')" class="invalid-feedback">Введите корректную сумму.</div>
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
                @input="validateComment"
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
          <button type="submit" class="btn btn-primary w-100">Добавить трату</button>
        </form>
      </div>

      <!-- Список трат -->
      <div class="col-md-6">
        <h2 class="text-primary">История трат</h2>
        <div v-for="(expenses, date) in groupedExpenses" :key="date" class="mb-4">
          <h4 class="text-secondary">{{ date }}</h4>
          <div class="card shadow-sm mb-2" v-for="(expense, index) in expenses" :key="index">
            <div class="card-body d-flex justify-content-between align-items-center">
              <div>
                <strong class="text-dark">{{ expense.category }}</strong> - {{ expense.amount }} ₽
                <br />
                <small class="text-muted">
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
            </div>
          </div>
        </div>
      </div>
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
      touchedFields: { // Флаг, отслеживающий, что поле было изменено
        category: false,
        amount: false,
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
    validateAmount() {
      if (this.newExpense.amount < 0) {
        this.newExpense.amount = 0;
      } else if (this.newExpense.amount > 2147483647) {
        this.newExpense.amount = 2147483647;
      }
    },

    validateCategory() {
      if (this.newExpense.category.length === 0) {
        this.newExpense.category = ''; // Оставляем пустое значение, если не введена категория
      } else if (this.newExpense.category.length > 30) {
        this.newExpense.category = this.newExpense.category.substring(0, 30); // Ограничиваем длину категории до 30 символов
      }
    },

    validateComment() {
      if (this.newExpense.comment.length === 0) {
        this.newExpense.comment = ''; // Оставляем пустое значение, если не введена категория
      } else if (this.newExpense.comment.length > 100) {
        this.newExpense.comment = this.newExpense.comment.substring(0, 100); // Ограничиваем длину категории до 100 символов
      }
    },

    addExpense() {
      if (!this.newExpense.category || this.newExpense.amount <= 0) {
        toastr.error("Пожалуйста, заполните все обязательные поля и введите корректную сумму.", "Ошибка");
        return;
      }

      if (!this.useCustomDate) {
        this.newExpense.date = new Date().toISOString();
      }

      this.expenses.push({...this.newExpense});
      localStorage.setItem('expenses', JSON.stringify(this.expenses));

      // Сброс флагов в touchedFields после добавления траты
      this.touchedFields = {
        category: false,
        amount: false,
      };

      // Очистка полей
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

    isFieldInvalid(field) {
      if (field === 'category') {
        return !this.newExpense.category && this.touchedFields.category;
      }
      if (field === 'amount') {
        return this.newExpense.amount <= 0 && this.touchedFields.amount;
      }
      return false;
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
