import Papa from 'papaparse';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
    const url = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQZGdq10dU05laEySow_drIEkLr8E6Xlmr6GNqIy7BVfaXH4TKskhy1e5N-9hWgIO31Fy7D4C6lllEA/pub?gid=0&single=true&output=csv';
    const response = await fetch(url);
    const text = await response.text();

    const parsed = Papa.parse(text, { header: true, skipEmptyLines: true, trimHeaders: true });

    // Pošleme surová data do frontendu, tam je zpracujeme v klidu
    return { data: parsed.data };
};
