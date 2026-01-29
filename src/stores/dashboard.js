import { defineStore } from "pinia";
import apiClient from "../../lib/axios";

const getLocalDate = (date) => {
    const offset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - offset).toISOString().split('T')[0];
};

export const useDashboardStore = defineStore("dashboard", {
    state: () => ({
        meta: {
            date: '-',
            last_updated: '-'
        },
        cards: {
            revenue_today: { value: 0, label: "Today's Revenue", prefix: 'Rp' },
            transactions_today: { value: 0, label: "Transactions", unit: 'Orders' },
            items_sold_today: { value: 0, label: "Items Sold", unit: 'Pcs' },
            revenue_month: { value: 0, label: "This Month", prefix: 'Rp' },
            average_order_value: { value: 0, label: "Avg. Order Value", prefix: 'Rp' },
            kitchen_load: { value: 0, label: "Active Orders", unit: 'Queue' }
        },
        topSellingItems: [],

        chartSeries: [],
        chartCategories: [],

        loading: false,
        error: null
    }),
    actions: {
        async fetchDashboardStats() {
            this.loading = true;
            this.error = null;
            try {
                const response = await apiClient.get('/admin/dashboard/summary');
                const data = response.data.data || response.data;

                this.meta = data.meta || { date: '-', last_updated: '-' };
                console.log("Response: ", response.data || response.data.data)
                if (data.cards) {
                    this.cards.revenue_today = { ...this.cards.revenue_today, ...data.cards.revenue_today };
                    this.cards.transactions_today = { ...this.cards.transactions_today, ...data.cards.transactions_today };
                    this.cards.items_sold_today = { ...this.cards.items_sold_today, ...data.cards.items_sold_today };
                    this.cards.revenue_month = { ...this.cards.revenue_month, ...data.cards.revenue_month };
                    this.cards.average_order_value = { ...this.cards.average_order_value, ...data.cards.average_order_value };
                    this.cards.kitchen_load = { ...this.cards.kitchen_load, ...data.cards.kitchen_load };
                }

                this.topSellingItems = data.top_selling_items || [];
            } catch (error) {
                console.error("Fetch Dashboard Error:", error);
            } finally {
                this.loading = false;
            }
        },
        async fetchChartData(startDate, endDate) {
            this.loading = true;
            try {
                console.log(`📊 Fetching Chart: ${startDate} to ${endDate}`);
                const response = await apiClient.get('/admin/reports/sales', {
                    params: {
                        start_date: startDate,
                        end_date: endDate,
                    }
                });

                const transactions = response.data.data || [];
                console.log(`Response transaksi: ${transactions.length}`);

                const grouped = {};
                let curr = new Date(startDate);
                const end = new Date(endDate);

                while (curr <= end) {
                    const dateStr = curr.toISOString().split('T')[0];
                    grouped[dateStr] = 0;
                    curr.setDate(curr.getDate() + 1);
                }

                transactions.forEach(trx => {
                    const trxDate = trx.date ? trx.date.substring(0, 10) : '';
                    const rawAmount = trx.total_amount ?? trx.total_price;
                    const amount = Number(rawAmount);

                    if (grouped[trxDate] !== undefined && !isNaN(amount)) {
                        grouped[trxDate] += amount;
                    } else {
                        console.warn(`⚠️ Tanggal transaksi ${trxDate} di luar range atau format salah.`);
                    }
                });

                this.chartCategories = Object.keys(grouped); // Sumbu X (Tanggal)
                this.chartSeries = Object.values(grouped);   // Sumbu Y (Total Revenue)

                console.log("📈 Final Chart Data:", this.chartSeries);

            } catch (error) {
                console.error("Fetch Chart Error:", error);

                this.chartCategories = [];
                this.chartSeries = [];
            } finally {
                this.loading = false;
            }
        },
        async exportSales(startDate, endDate) {
            try {
                const response = await apiClient.get('/admin/reports/sales', {
                    params: {
                        start_date: startDate,
                        end_date: endDate,
                        export: 'csv'
                    },
                    responseType: 'blob'
                });
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `Sales_Report_${startDate}_to_${endDate}.csv`);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                return true;
            } catch (err) {
                console.error("Export Failed:", err);
                alert("Failed to export sales.");
                return false;
            }
        },
    }
})