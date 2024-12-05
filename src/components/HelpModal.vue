<template>
  <div v-if="showHelp" class="modal d-block" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Подсказка</h5>
          <button type="button" class="btn-close" @click="closeModal"></button>
        </div>
        <div class="modal-body">
          <p>Добро пожаловать в <strong>Финансовый трекер</strong>! Этот инструмент поможет вам эффективно управлять
            своим бюджетом и расходами. Вот как это работает:</p>

          <!-- Пункт 1: Настройки -->
          <div class="accordion" id="helpAccordion">
            <div class="accordion-item">
              <h2 class="accordion-header" id="headingOne">
                <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne"
                        aria-expanded="true" aria-controls="collapseOne">
                  1. Настройки
                </button>
              </h2>
              <div id="collapseOne" class="accordion-collapse collapse show" aria-labelledby="headingOne"
                   data-bs-parent="#helpAccordion">
                <div class="accordion-body">
                  <ul>
                    <li><strong>Доход:</strong> Укажите ваш общий доход за выбранный период (например, 50,000 ₽). Это
                      необходимо для расчётов.
                    </li>
                    <li><strong>Сбережения (%):</strong> Укажите процент от дохода для сбережений (например, 10%). Эта
                      сумма будет вычитаться из дохода перед расчётом доступных средств.
                    </li>
                    <li><strong>Обязательные траты:</strong> Укажите фиксированные расходы, такие как аренда или кредиты
                      (например, 10,000 ₽). Эти расходы будут вычитаться из дохода.
                    </li>
                    <li><strong>Дата начала и конца расчёта:</strong> Укажите период для расчёта (например, с 1 по 31
                      декабря).
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <!-- Пункт 2: Результаты -->
            <div class="accordion-item">
              <h2 class="accordion-header" id="headingTwo">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                        data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                  2. Результаты
                </button>
              </h2>
              <div id="collapseTwo" class="accordion-collapse collapse" aria-labelledby="headingTwo"
                   data-bs-parent="#helpAccordion">
                <div class="accordion-body">
                  <ul>
                    <li><strong>Дневной лимит (без учёта трат):</strong> Это сумма, которую вы можете тратить ежедневно,
                      не учитывая фактические траты. Она рассчитывается по формуле:
                      <br><em>(Доход - Сбережения - Обязательные траты) ÷ Количество дней</em>.
                    </li>
                    <li><strong>Дневной лимит (с учётом трат):</strong> Это сумма, которая остаётся после учёта ваших
                      фактических расходов. Она пересчитывается ежедневно в зависимости от ваших трат.
                    </li>
                    <li><strong>Остаток:</strong> Сумма, которая остаётся у вас до конца периода, после учёта всех
                      вычетов и трат.
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <!-- Пункт 3: Расчёт с тратами -->
            <div class="accordion-item">
              <h2 class="accordion-header" id="headingThree">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                        data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                  3. Расчёт с учётом трат
                </button>
              </h2>
              <div id="collapseThree" class="accordion-collapse collapse" aria-labelledby="headingThree"
                   data-bs-parent="#helpAccordion">
                <div class="accordion-body">
                  <p>Каждый день ваши доходы пересчитываются: если вы тратите меньше дневного лимита, неиспользованные
                    средства переходят на следующий день. Если вы превышаете лимит, остаток уменьшается.</p>
                  <p><strong>Пример:</strong></p>
                  <ul>
                    <li>Доход: 30,000 ₽, обязательные траты: 10,000 ₽, сбережения: 10%.</li>
                    <li>Дневной лимит без учёта трат: <br><em>(30,000 - 10,000 - 3,000) ÷ 30 = 566,67 ₽</em>.</li>
                    <li>Если вы потратили 400 ₽ в первый день, на следующий день лимит увеличится: <br><em>566,67 ₽ +
                      (566,67 ₽ - 400 ₽) = 733,34 ₽</em>.
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <!-- Пункт 4: Как вносить траты -->
            <div class="accordion-item">
              <h2 class="accordion-header" id="headingFour">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                        data-bs-target="#collapseFour" aria-expanded="false" aria-controls="collapseFour">
                  4. Как вносить траты?
                </button>
              </h2>
              <div id="collapseFour" class="accordion-collapse collapse" aria-labelledby="headingFour"
                   data-bs-parent="#helpAccordion">
                <div class="accordion-body">
                  <p>Вы можете вручную записывать свои расходы в разделе <strong>Траты</strong>. В будущем будет
                    добавлена возможность автоматически учитывать траты.</p>
                </div>
              </div>
            </div>

            <!-- Пункт 5: Как использовать результаты -->
            <div class="accordion-item">
              <h2 class="accordion-header" id="headingFive">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                        data-bs-target="#collapseFive" aria-expanded="false" aria-controls="collapseFive">
                  5. Как использовать результаты?
                </button>
              </h2>
              <div id="collapseFive" class="accordion-collapse collapse" aria-labelledby="headingFive"
                   data-bs-parent="#helpAccordion">
                <div class="accordion-body">
                  <p>Используйте дневной лимит как ориентир для своих ежедневных трат. Если у вас остаётся
                    неиспользованный лимит, вы можете перераспределить его на будущее или увеличить сбережения.</p>
                </div>
              </div>
            </div>

            <!-- Пункт 6: Хранение данных -->
            <div class="accordion-item">
              <h2 class="accordion-header" id="headingSix">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                        data-bs-target="#collapseSix" aria-expanded="false" aria-controls="collapseSix">
                  6. Хранение данных
                </button>
              </h2>
              <div id="collapseSix" class="accordion-collapse collapse" aria-labelledby="headingSix"
                   data-bs-parent="#helpAccordion">
                <div class="accordion-body">
                  <p>Все данные сохраняются локально на вашем устройстве. Это означает, что если вы очистите локальное
                    хранилище браузера, все данные будут утеряны.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "HelpModal",
  props: {
    showHelp: {
      type: Boolean,
      required: true,
    },
  },
  methods: {
    closeModal() {
      this.$emit('closeModal'); // Отправляем событие в родительский компонент
    },
  },
}
</script>
