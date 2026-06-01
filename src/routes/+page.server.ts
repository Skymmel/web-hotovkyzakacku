import Papa from 'papaparse';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
    const url = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQZGdq10dU05laEySow_drIEkLr8E6Xlmr6GNqIy7BVfaXH4TKskhy1e5N-9hWgIO31Fy7D4C6lllEA/pub?gid=0&single=true&output=csv';

    try {
        const response = await fetch(url, { cache: 'no-store' });
        if (!response.ok) {
            console.error('Failed to fetch CSV:', response.status, response.statusText);
            return { menu: {}, currentWeek: 0, error: 'Data source unavailable' } as any;
        }

        const text = await response.text();

        const { data } = Papa.parse(text, { header: true, skipEmptyLines: true, trimHeaders: true });

        const d = new Date();
        d.setHours(0, 0, 0, 0);
        d.setDate(d.getDate() + 4 - (d.getDay() || 7));
        const currentWeek = Math.ceil((((d.getTime() - new Date(d.getFullYear(), 0, 1).getTime()) / 86400000) + 1) / 7);

        const menu = (data as any[] || []).reduce((acc: any, p: any) => {
            const tw = parseInt(p.Týden);
            if (isNaN(tw)) return acc;
            if (tw !== currentWeek && tw !== currentWeek + 1) return acc;

            if (!acc[tw]) acc[tw] = {};
            if (!acc[tw][p.Den]) acc[tw][p.Den] = { datum: p.Datum || "", polevky: [], jidla: [] };

            if ((p.Kategorie || '').trim() === 'Polévka') {
                acc[tw][p.Den].polevky.push(p);
            } else {
                acc[tw][p.Den].jidla.push(p);
            }
            return acc;
        }, {});

        return { menu: menu || {}, currentWeek } as any;
    } catch (err) {
        console.error('Error in load:', err);
        return { menu: {}, currentWeek: 0, error: 'Internal server error' } as any;
    }
};
