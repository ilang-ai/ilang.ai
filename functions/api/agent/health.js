import { json } from '../../_lib.js';
export async function onRequestGet() { return json({ status: 'ok', service: 'ilang.ai public lookup API', time: new Date().toISOString() }, 200, { 'Cache-Control': 'no-store' }); }
