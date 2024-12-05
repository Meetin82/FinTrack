<template>
  <div class="container mt-4">
    <h2>Долги</h2>
    <form @submit.prevent="addDebt">
      <div class="mb-3">
        <label for="debtor" class="form-label">Имя</label>
        <input
            type="text"
            id="debtor"
            v-model="newDebt.debtor"
            class="form-control"
        />
      </div>
      <div class="mb-3">
        <label for="amount" class="form-label">Сумма</label>
        <input
            type="number"
            id="amount"
            v-model="newDebt.amount"
            class="form-control"
        />
      </div>
      <button type="submit" class="btn btn-primary">Добавить долг</button>
    </form>

    <hr />

    <h3>Список долгов</h3>
    <ul class="list-group">
      <li
          class="list-group-item d-flex justify-content-between align-items-center"
          v-for="(debt, index) in debts"
          :key="index"
      >
        <div>
          <strong>{{ debt.debtor }}</strong> - {{ debt.amount }} ₽
        </div>
        <button class="btn btn-danger btn-sm" @click="removeDebt(index)">
          Удалить
        </button>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'DebtsComponent',
  data() {
    return {
      newDebt: {
        debtor: '',
        amount: 0,
      },
      debts: [],
    };
  },
  methods: {
    addDebt() {
      if (!this.newDebt.debtor || this.newDebt.amount <= 0) {
        alert('Введите корректные данные!');
        return;
      }
      this.debts.push({ ...this.newDebt });
      localStorage.setItem('debts', JSON.stringify(this.debts));
      this.newDebt = { debtor: '', amount: 0 };
    },
    removeDebt(index) {
      this.debts.splice(index, 1);
      localStorage.setItem('debts', JSON.stringify(this.debts));
    },
  },
  created() {
    const savedDebts = localStorage.getItem('debts');
    if (savedDebts) {
      this.debts = JSON.parse(savedDebts);
    }
  },
};
</script>
