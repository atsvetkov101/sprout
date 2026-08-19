/**
 * Скрипт демонстрирует, что new Date(1705312200000) — это валидная дата,
 * и проверка isNaN(deadline.getTime()) НЕ выбрасывает ошибку.
 */

const timestamp = 1705312200000;
const deadline = new Date(timestamp);

console.log('timestamp:', timestamp);
console.log('new Date(timestamp):', deadline);
console.log('deadline.getTime():', deadline.getTime());
console.log('isNaN(deadline.getTime()):', isNaN(deadline.getTime()));

if (isNaN(deadline.getTime())) {
    console.log('❌ Ошибка: Invalid deadline');
} else {
    console.log('✅ Дата валидна, ошибки НЕТ');
}