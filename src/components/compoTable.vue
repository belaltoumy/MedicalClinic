<template>
  <div class="table-container">
    <!-- حالة التحميل -->
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner">
        <svg
          class="animate-spin"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
            class="opacity-25"
          ></circle>
          <path
            fill="currentColor"
            class="opacity-75"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      </div>
      <p class="loading-text">{{ loadingText }}</p>
    </div>

    <!-- حالة عدم وجود بيانات -->
    <div v-else-if="!props.rows || props.rows.length === 0" class="empty-state">
      <div class="empty-icon">
        <svg fill="currentColor" viewBox="0 0 20 20">
          <path
            fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clip-rule="evenodd"
          ></path>
        </svg>
      </div>
      <p class="empty-text">{{ emptyText }}</p>
    </div>

    <!-- الجدول -->
    <div v-else class="table-wrapper">
      <table class="data-table">
        <thead class="table-header">
          <tr>
            <th v-if="showIndex" class="index-header">#</th>
            <!-- // الأعمدة مع الفلترة -->
            <th
              v-for="col in props.columns"
              :key="col.key"
              class="column-header"
            >
              <div class="column-title">
                {{ col.label }}
                <span @click="toggleDropdown(col.key)" class="dropdown-trigger">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    />
                  </svg>
                </span>

                <transition name="dropdown-fade">
                  <div v-if="dropdowns[col.key]" class="dropdown-menu">
                    <div
                      v-for="option in uniqueValues(col.key)"
                      :key="option"
                      class="dropdown-item"
                    >
                      <label>
                        <input
                          type="checkbox"
                          :value="option"
                          v-model="filters[col.key]"
                        />
                        <span>{{ option }}</span>
                      </label>
                    </div>
                  </div>
                </transition>
              </div>
            </th>
            <th v-if="$slots.actions || showActions" class="actions-header">
              الإجراءات
            </th>
          </tr>
        </thead>

        <tbody class="table-body">
          <tr
            v-for="(row, rowIndex) in filteredRows"
            :key="row[idKey] ?? rowIndex"
            class="table-row"
          >
            <td v-if="showIndex" class="index-cell">{{ rowIndex + 1 }}</td>
            <td
              v-for="col in props.columns"
              :key="col.key"
              class="data-cell"
              :class="col.tdClass"
            >
              <slot :name="`cell:${col.key}`" :row="row" :value="row[col.key]">
                <span :class="col.textClass || 'cell-text'">{{
                  formatCell(row[col.key], col)
                }}</span>
              </slot>
            </td>
            <td v-if="$slots.actions || showActions" class="actions-cell">
              <div class="actions-container">
                <slot name="actions" :row="row" :index="rowIndex"></slot>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed } from "vue";

const props = defineProps({
  columns: { type: Array, required: true },
  rows: { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
  loadingText: { type: String, default: "جارِ التحميل..." },
  emptyText: { type: String, default: "لا توجد بيانات." },
  showIndex: { type: Boolean, default: true },
  showActions: { type: Boolean, default: false },
  idKey: { type: String, default: "id" },
});

// Dropdowns و filters لكل عمود
const dropdowns = reactive({});
const filters = reactive({});

props.columns.forEach((col) => {
  dropdowns[col.key] = false;
  filters[col.key] = [];
});

const formatCell = (val, col) => {
  if (typeof col.formatter === "function") return col.formatter(val);
  if (typeof val === "boolean") return val ? "نعم" : "لا";
  return val ?? "-";
};

const toggleDropdown = (colKey) => {
  dropdowns[colKey] = !dropdowns[colKey];
};

// القيم الفريدة لكل عمود
const uniqueValues = (colKey) => {
  return [...new Set(props.rows.map((row) => row[colKey]))];
};

// الفلترة حسب الـ filters
const filteredRows = computed(() => {
  let result = props.rows;

  Object.keys(filters).forEach((colKey) => {
    if (filters[colKey].length > 0) {
      result = result.filter((row) => filters[colKey].includes(row[colKey]));
    }
  });

  return result;
});
</script>

<style scoped>
/* الحاوية الرئيسية */
.table-container {
  width: 100%;
  height: 75vh;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #f1f5f9;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* حالة التحميل */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #6b7280;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  color: red;
  margin-bottom: 16px;
}

.loading-text {
  font-size: 16px;
  font-weight: 500;
  margin: 0;
}

/* حالة عدم وجود بيانات */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #9ca3af;
}

.empty-icon {
  width: 48px;
  height: 48px;
  margin-bottom: 16px;
  color: #d1d5db;
}

.empty-text {
  font-size: 16px;
  font-weight: 500;
  margin: 0;
}

/* قائمة منسدلة لكل عمود */
.column-title {
  position: relative; /* هذا يجعل القائمة absolute بالنسبة للعمود */
  display: inline-block;
}

.dropdown-arrow {
  margin-left: 6px;
  font-size: 12px;
  user-select: none;
}

.dropdown-menu {
  color: var(--color-primary-900);
  background: var(--color-accent-500);

  position: absolute;
  top: 100%; /* أسفل عنوان العمود مباشرة */
  left: 50%;
  transform: translateX(-50%);
  z-index: 999; /* تأكد أنها فوق كل شيء */
  min-width: 160px;
  max-height: 300px;
  overflow-y: auto; /* إذا كانت كثيرة العناصر */
}

.dropdown-item {
  padding: 4px 12px;
  white-space: nowrap;
}

.dropdown-item label {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  font-size: 14px;
}

.dropdown-item:hover {
  background-color: #f3f4f6;
}

/* حاوية الجدول
.table-wrapper {
  overflow-x: auto;
} */

/* الجدول */
.data-table {
  width: 100%;
  border-collapse: collapse;
}

/* رأس الجدول */
.table-header {
  background: var(--color-primary-700);
}

.table-header th {
  padding: 16px 12px;
  text-align: center;
  font-size: 14px;
  font-weight: 600;
  color: white;
  border-bottom: 2px solid var(--color-primary-900);
  position: relative;
}

.index-header {
  width: 60px;
}

.column-header {
  min-width: 120px;
}

.actions-header {
  min-width: 140px;
}

/* جسم الجدول */
.table-body {
  background: white;
}

.table-row {
  transition: all 0.2s ease;
}

.table-row:hover {
  background: linear-gradient(135deg, #f8fafc, #f1f5f9);
}

.table-row:nth-child(even) {
  background: #fafbfc;
}

.table-row:nth-child(even):hover {
  background: linear-gradient(135deg, #f8fafc, #f1f5f9);
}

/* خلايا البيانات */
.table-row td {
  padding: 8px 8px;
  text-align: center;
  border-bottom: 1px solid #f1f5f9;
}

.index-cell {
  font-weight: 600;
  color: var(--color-primary-700);
  background: linear-gradient(135deg, #eff6ff, #dbeafe);
  font-size: 14px;
}

.data-cell {
  color: #374151;
  font-size: 14px;
}

.cell-text {
  color: #374151;
  font-weight: 500;
}

/* خلية الإجراءات */
.actions-cell {
  padding: 12px;
}

.actions-container {
  display: flex;
  gap: 8px;
  justify-content: center;
  align-items: center;
}

/* تحسينات للشاشات الصغيرة */
@media (max-width: 768px) {
  .table-wrapper {
    overflow-x: scroll;
  }

  .data-table {
    min-width: 600px;
  }

  .table-header th,
  .table-row td {
    padding: 12px 8px;
    font-size: 13px;
  }

  .actions-container {
    flex-direction: column;
    gap: 4px;
  }
}

/* تأثيرات الأنيميشن */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.table-container {
  animation: fadeIn 0.5s ease-out;
}

/* تحسين أزرار الإجراءات */
.actions-container button {
  transition: all 0.2s ease;
  border-radius: 8px;
  font-weight: 500;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.actions-container button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}
/* زر السهم */
.dropdown-trigger {
  margin-right: 6px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  transition: transform 0.25s ease;
}

.dropdown-trigger:hover {
  transform: rotate(180deg);
}

/* القائمة */
.dropdown-menu {
  position: absolute;
  top: 110%;
  left: 50%;
  transform: translateX(-50%);
  background: white;
  color: #1f2937;
  border-radius: 12px;
  padding: 8px 0;
  min-width: 180px;
  max-height: 240px;
  overflow-y: auto;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15), 0 4px 10px rgba(0, 0, 0, 0.08);
  z-index: 1000;
}

/* عناصر القائمة */
.dropdown-item {
  padding: 6px 14px;
  transition: background 0.2s ease;
}

.dropdown-item:hover {
  background: #f1f5f9;
}

/* الليبل */
.dropdown-item label {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  cursor: pointer;
}

/* checkbox */
.dropdown-item input[type="checkbox"] {
  accent-color: var(--color-primary-700);
  width: 15px;
  height: 15px;
}

/* أنيميشن */
.dropdown-fade-enter-active,
.dropdown-fade-leave-active {
  transition: all 0.2s ease;
}

.dropdown-fade-enter-from {
  opacity: 0;
  transform: translateX(-50%) translateY(-5px);
}

.dropdown-fade-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-5px);
}
</style>
