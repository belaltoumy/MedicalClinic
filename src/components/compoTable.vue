<template>
    <div class="table-container">
        <!-- حالة التحميل -->
        <div v-if="loading" class="loading-state">
            <div class="loading-spinner">
                <svg class="animate-spin" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" class="opacity-25"></circle>
                    <path fill="currentColor" class="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            </div>
            <p class="loading-text">{{ loadingText }}</p>
        </div>
        
        <!-- حالة عدم وجود بيانات -->
        <div v-else-if="!rows || rows.length === 0" class="empty-state">
            <div class="empty-icon">
                <svg fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
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
                        <th v-for="col in columns" :key="col.key" class="column-header">
                            {{ col.label }}
                        </th>
                        <th v-if="$slots.actions || showActions" class="actions-header">الإجراءات</th>
                    </tr>
                </thead>
                <tbody class="table-body">
                    <tr v-for="(row, rowIndex) in rows" :key="row[idKey] ?? rowIndex" class="table-row">
                        <td v-if="showIndex" class="index-cell">{{ rowIndex + 1 }}</td>
                        <td v-for="col in columns" :key="col.key" class="data-cell" :class="col.tdClass">
                            <slot :name="`cell:${col.key}`" :row="row" :value="row[col.key]">
                                <span :class="col.textClass || 'cell-text'">{{ formatCell(row[col.key], col) }}</span>
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
const props = defineProps({
    columns: { type: Array, required: true }, // [{ key, label, formatter?, textClass?, tdClass? }]
    rows: { type: Array, default: () => [] },
    loading: { type: Boolean, default: false },
    loadingText: { type: String, default: 'جارِ التحميل...' },
    emptyText: { type: String, default: 'لا توجد بيانات.' },
    showIndex: { type: Boolean, default: true },
    showActions: { type: Boolean, default: false },
    idKey: { type: String, default: 'id' },
});

const formatCell = (val, col) => {
    if (typeof col.formatter === 'function') return col.formatter(val);
    if (typeof val === 'boolean') return val ? 'نعم' : 'لا';
    return val ?? '-';
};
</script>

<style scoped>
/* الحاوية الرئيسية */
.table-container {
    width: 100%;
    background: white;
    border-radius: 16px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    border: 1px solid #f1f5f9;
    overflow: hidden;
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
    color: #1e40af;
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

/* حاوية الجدول */
.table-wrapper {
    overflow-x: auto;
}

/* الجدول */
.data-table {
    width: 100%;
    border-collapse: collapse;
}

/* رأس الجدول */
.table-header {
    background: linear-gradient(135deg, #1e40af, #3b82f6);
}

.table-header th {
    padding: 16px 12px;
    text-align: center;
    font-size: 14px;
    font-weight: 600;
    color: white;
    border-bottom: 2px solid #1d4ed8;
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
    transform: translateX(-2px);
}

.table-row:nth-child(even) {
    background: #fafbfc;
}

.table-row:nth-child(even):hover {
    background: linear-gradient(135deg, #f8fafc, #f1f5f9);
}

/* خلايا البيانات */
.table-row td {
    padding: 16px 12px;
    text-align: center;
    border-bottom: 1px solid #f1f5f9;
}

.index-cell {
    font-weight: 600;
    color: #1e40af;
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
</style>