<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">FinTrack</a>
      <ul class="navbar-nav">
        <li class="nav-item">
          <router-link to="/" class="nav-link">Главная</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/expenses" class="nav-link">Траты</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/analytics" class="nav-link">Аналитика</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/debts" class="nav-link">Долги</router-link>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'HeaderComponent',

  methods: {

  },
};
</script>
