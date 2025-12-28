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

.table-container {
  width: 100%;
  max-height: 75vh;
  background: white;
  border-radius: 16px;
  border: 1px solid #f1f5f9;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.table-wrapper {
  flex: 1;
  overflow-x: auto;
  overflow-y: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 700px; /* 🔑 يمنع تكسير الأعمدة */
}

.table-header {
  background: var(--color-primary-700);
}

.table-header th {
  padding: 14px 10px;
  font-size: 14px;
  font-weight: 600;
  color: white;
  text-align: center;
  border-bottom: 2px solid var(--color-primary-900);
  white-space: nowrap;
}

.index-header {
  width: 60px;
}

.column-header {
  min-width: 120px;
}

.actions-header {
  width: 100px;
}

.table-body {
  background: white;
}

.table-row:nth-child(even) {
  background: #fafbfc;
}

.table-row:hover {
  background: #f8fafc;
}

.table-row td {
  padding: 8px 6px;
  text-align: center;
  border-bottom: 1px solid #f1f5f9;
  font-size: 14px;
  white-space: nowrap;
}

.index-cell {
  font-weight: 600;
  color: var(--color-primary-700);
  background: #eff6ff;
}

.actions-cell {
  text-align: center;
}

.actions-container {
  display: flex;
  flex-wrap: nowrap;        /* 🔑 يمنع نزول الأزرار */
  gap: 6px;
  justify-content: center;
  align-items: center;
}

/* الأزرار */
.actions-container button {
  padding: 6px 10px;
  font-size: 13px;
  border-radius: 8px;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.actions-container button:hover {
  transform: translateY(-1px);
}

.column-title {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.dropdown-trigger {
  cursor: pointer;
  transition: transform 0.25s ease;
}

.dropdown-trigger:hover {
  transform: rotate(180deg);
}

.dropdown-menu {
  color: var(--color-primary-700);
  position: absolute;
  top: 110%;
  left: 50%;
  transform: translateX(-50%);
  background: white;
  border-radius: 12px;
  padding: 6px 0;
  min-width: 180px;
  max-height: 240px;
  overflow-y: auto;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  z-index: 1000;
}

.dropdown-item {
  padding: 6px 14px;
}

.dropdown-item:hover {
  background: #f1f5f9;
}

.dropdown-item label {
  display: flex;
  gap: 10px;
  font-size: 14px;
  cursor: pointer;
}

.loading-text {
  margin-top: 12px;
  font-size: 14px;
  font-weight: 500;
  color: var(--color-primary-700);
  text-align: center;
}
.loading-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.empty-text {
  font-size: 15px;
  font-weight: 500;
  color: #64748b;
}

@media (max-width: 768px) {
  .data-table {
    min-width: 600px;
  }

  .table-header th,
  .table-row td {
    font-size: 12px;
    padding: 6px 4px;
  }

  /* تصغير الأزرار */
  .actions-container button {
    padding: 4px 6px;
    font-size: 11px;
  }

  /* إخفاء النص وترك الأيقونة */
  .btn-text {
    display: none;
  }

  /* تثبيت عرض عمود الإجراءات */
  .actions-header,
  .actions-cell {
    width: 80px;
  }
}

</style>
